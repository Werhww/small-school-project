import express from "express"
import multer from "multer"
import { join } from "path"
import { sha256 } from "./utils";
import cookieParser from "cookie-parser";
import { $Enums, Companie, Personal, Platoon, User } from "@prisma/client";
import { addImageToUser, addManagerToCompanie, addParrentToUser, addPersonalToUser, addPlatoonToUser, createCompanie, createManager, createParrent, createPlatoon, createUser, deleteCompanie, deletePlatoon, deleteUser, disconnectParretFromUser, editCompanie, editPlatoon, findCompanieById, findCompanieManagerById, findCompaniesByManagerId, findCompaniesByUserId, findManagerByUserId, findManagersCompanieById, findManagersPersonalByCompanieId, findMemberByUserId, findPersonalByUserId, findPictureByPersonalId, findPlatoonById, findPlatoonDataForDelete, findPlatoonIdByUserId, findUserById, findUserByPassword, findUserByToken, getAllCompanies, getAllManagers, getAllMembers, getAllParrents, getAllPlatoons, getAllUsers, removeCompanieFromManager, updateMember, updatePersonal } from "./prisma/prisma";

const app = express()
const upload = multer()

app.use(express.json({ limit: "50mb" }))
app.use(express.static(join(__dirname, "public")))
app.use(cookieParser())

app.use (async (req, res, next) => {
    if(req.path === "/api/auth") return next();

    const token = req.cookies.token
    if(!token) return res.json({ success: false, message: "Du må logge inn.", redirect: "/auth" });
    next();
})

app.listen(3235, () => {
    console.log("http://localhost:3235");
})

app.post("/api/auth", async (req, res) => {
    const { password } = req.body as User
    const hash = sha256(password);
    
    const user = await findUserByPassword(hash);
    console.log(user);

    if (user) {
        res.cookie("token", user.token, { maxAge: 1000*60*60*60*24*7, httpOnly: true  });

        const personal = await findPersonalByUserId(user.id)
        if(!personal) {
            res.json({ success: true, message: "Brukeren har ikke personlig informasjon.", redirect: "/personal" });
            return
        }

        if(user.role === $Enums.Role.MEMBER) {
            res.json({ success: true, message: "Brukeren ble funnet.", redirect: "/" });
            return
        } else if(user.role === $Enums.Role.MANAGER) {
            res.json({ success: true, message: "Brukeren ble funnet.", redirect: "/dashboard" });
            return
        } else if(user.role === $Enums.Role.PARRENT) {
            res.json({ success: true, message: "Brukeren ble funnet.", redirect: "/" });
            return
        } else {
            res.json({ success: true, message: "Brukeren ble funnet.", redirect: "/admin" });
            return
        }
    } else {
        res.json({ success: false, message: "Feil passord." });
    }
})

app.get("/api/auth/admin", async (req, res) => {
    const token = req.cookies.token
    const user = await findUserByToken(token)

    if(!user) {
        res.json({ success: false, message: "Bruker ble ikke funnet.", redirect: "/auth" });
        return
    } else if(user.role !== $Enums.Role.ADMIN) {
        if(user.role === $Enums.Role.MANAGER) {
            res.json({ success: false, message: "Bruker er ikke admin.", redirect: "/dashboard" });
            return
        }

        res.json({ success: false, message: "Bruker har ikke tilgang.", redirect: "/" });
        return
    }

    res.json({ success: true, message: "Bruker har tilgang." });
})

app.get("/api/logout", async (req, res) => {
    res.clearCookie("token")
    res.redirect("/auth")
})

/* User api calls */
app.post("/api/user/create", async (req, res) => {
    const body = req.body as User
    const hash = sha256(body.password);

    const user = await findUserByPassword(hash);

    if (user) {
        res.json({ success: false, message: "Brukeren eksisterer allerede." });
    } else {
        const user = await createUser({ ...body, password: hash })

        if(body.role === $Enums.Role.MANAGER) {
            await createManager(user.id)
        }

        if(body.role === $Enums.Role.PARRENT) {
            await createParrent(user.id)
        }
        
        res.json({ success: true, message: "Brukeren ble opprettet.", data: user  });
    }
}) 

app.get("/api/user/personal/token", async (req, res) => {
    const token = req.cookies.token
    const user = await findUserByToken(token)

    if(!user) {
        res.json({ success: false, message: "Bruker ble ikke funnet." });
        return
    }

    const personal = await findPersonalByUserId(user.id)
    
    if(personal) {
        res.json({ success: true, data: personal });
    } else {
        res.json({ success: false, message: "Brukeren har ikke personlig informasjon." });
    }

})

app.post("/api/user/personal/id", async (req, res) => {
    const { userId } = req.body
    const personal = await findPersonalByUserId(userId)

    if(personal) {
        res.json({ success: true, data: personal });
    } else {
        res.json({ success: false, message: "Brukeren har ikke personlig informasjon." });
    }
})
 
app.post("/api/user/personal/update", async (req, res) => {
    const body = req.body as Personal
    const token = req.cookies.token 
    const user = await findUserByToken(token);
  
    if (!user) return res.json({ success: false, message: "Brukeren eksisterer ikke.", redirect: "/auth" });
    const redirect = user.role === $Enums.Role.MEMBER ? "/" : "/dashboard"


    const personal = await findPersonalByUserId(user.id)

    if (personal) {
        const update = await updatePersonal(personal.id, body).catch(() => null)

        if(!update) return res.json({ success: false, message: "Epost eller mobil nummer er alerede i bruk", redirect:"/auth" });
        return res.json({ success: true, message: "Brukeren ble oppdatert.", redirect});
    } 

    const update = await addPersonalToUser(user.id, body).catch(() => null)

    if(!update) return res.json({ success: false, message: "Epost eller mobil nummer er alerede i bruk", redirect:"/auth" });
    res.json({ success: true, message: "Brukeren ble oppdatert.", redirect });
})

app.post("/api/user/personal/updateWithId", async (req, res) => {
    const { userId, personalBody } = req.body as { userId: number, personalBody: Personal }
    const token = req.cookies.token 
    const user = await findUserByToken(token);

    if (user) {
        if(user.role == $Enums.Role.MEMBER || user.role == $Enums.Role.PARRENT) {
            res.json({ success: false, message: "Brukeren har ikke tilgang til dette." });
            return
        }
        
        const personal = await findPersonalByUserId(userId)
        if (personal) {
            try {
                await updatePersonal(personal.id, personalBody)
            } catch(e) {
                console.log(e);
                return res.json({ success: false, message: "Epost eller mobil nummer er alerede i bruk" });
            }

            return res.json({ success: true, message: "Brukeren ble oppdatert." });
        } 

        try {
            await addPersonalToUser(userId, personalBody)
        } catch(e) {
            console.log(e);
            res.json({ success: false, message: "Epost eller mobil nummer er alerede i bruk" });
            return
        }
 
 
        res.json({ success: true, message: "Brukeren ble oppdatert." });
    } else {
        res.json({ success: false, message: "Brukeren eksisterer ikke." });
    }
})

app.post("/api/user/image/add", upload.single("file"), async (req, res) => {
    const buffer = req.file?.buffer
    const token = req.cookies.token
    
    if(!buffer) return res.json({ success: false, message: "Error med overføring av bilde." });
    
    const user = await findUserByToken(token);
    if(!user) return res.json({ success: false, message: "Brukeren eksisterer ikke." });


    await addImageToUser(user.id, buffer)
    res.json({ success: true, message: "Brukeren ble oppdatert." });
})

app.get("/api/user/image/:id", async (req, res) => {
    const { id } = req.params
    const data = await findPictureByPersonalId(Number(id));

    if(!data || !data.picture) {
        res.writeHead(200, {
            'Content-Type': "image/*",
            'Content-disposition': 'attachment;filename=' + "NoImage",
            'Content-Length': 0
        })

        res.end(Buffer.from([]));
        return
    }

    res.writeHead(200, {
        'Content-Type': "image/*",
        'Content-disposition': 'attachment;filename=' + "ProfilePicture",
        'Content-Length': data.picture.length
    })

    res.end(data.picture);
})

app.post("/api/user/connectToParrent", async (req, res) => {
    const token = req.cookies.token
    const { userId, parrentId } = req.body
    const user = await findUserByToken(token);  

    if (user) {
        if(user.role == $Enums.Role.MEMBER || user.role == $Enums.Role.PARRENT) {
            res.json({ success: false, message: "Brukeren har ikke tilgang til dette." });
            return
        }

        await addParrentToUser(userId, parrentId);
        res.json({ success: true, message: "Brukeren ble oppdatert." });
    } else {
        res.json({ success: false, message: "Brukeren eksisterer ikke.", redirect: "/auth" });
    }
})

app.post("/api/user/disconnectParrent", async (req, res) => {
    const token = req.cookies.token
    const { userId, parrentId } = req.body
    const user = await findUserByToken(token);  

    if (user) {
        if(user.role == $Enums.Role.MEMBER || user.role == $Enums.Role.PARRENT) {
            res.json({ success: false, message: "Brukeren har ikke tilgang til dette." });
            return
        }

        await disconnectParretFromUser(userId, parrentId);
        res.json({ success: true, message: "Brukeren ble oppdatert." });
    } else {
        res.json({ success: false, message: "Brukeren eksisterer ikke.", redirect: "/auth" });
    }
})

app.post("/api/user/connectToPlatoon", async (req, res) => {
    const token = req.cookies.token
    const { userId, platoonId } = req.body
    const user = await findUserByToken(token);

    if (user) {
        if(user.role == $Enums.Role.MEMBER || user.role == $Enums.Role.PARRENT) {
            res.json({ success: false, message: "Brukeren har ikke tilgang til dette." });
            return
        }

        await addPlatoonToUser(userId, platoonId);
        res.json({ success: true, message: "Brukeren ble oppdatert." });
    } else {
        res.json({ success: false, message: "Brukeren eksisterer ikke." });
    }
})

app.post("/api/user/changePlatoon", async (req, res) => {
    const token = req.cookies.token
    const { userId, platoonId } = req.body
    const user = await findUserByToken(token);


    if (user) {
        if(user.role == $Enums.Role.MEMBER || user.role == $Enums.Role.PARRENT) {
            res.json({ success: false, message: "Brukeren har ikke tilgang til dette." });
            return
        }
        const data = await findMemberByUserId(userId)
        if(!data) {
            await addPlatoonToUser(userId, platoonId);
            res.json({ success: true, message: "Brukeren ble oppdatert." });
            return
        } 

        await updateMember(userId, platoonId);
        res.json({ success: true, message: "Brukeren ble oppdatert." });
    } else {
        res.json({ success: false, message: "Brukeren eksisterer ikke." });
    }
})

app.post("/api/user/delete", async (req, res) => {
    const token = req.cookies.token
    const { userId } = req.body
    const user = await findUserByToken(token);

    if (user) {
        if(user.role == $Enums.Role.MEMBER || user.role == $Enums.Role.PARRENT) {
            res.json({ success: false, message: "Brukeren har ikke tilgang til dette." });
            return
        }

        await deleteUser(userId);
        res.json({ success: true, message: "Brukeren ble oppdatert." });
    } else {
        res.json({ success: false, message: "Brukeren eksisterer ikke." });
    }
})

/* Companie api calls */
app.post("/api/companie/create", async (req, res) => {
    const body = req.body as Companie
    const token = req.cookies.token

    const user = await findUserByToken(token)
    if(!user) {
        res.json({ success: false, message: "Bruker ble ikke funnet.", redirect: "/auth" })
        return
    }

    const companie = await createCompanie(body);

    if (user.role == $Enums.Role.MANAGER) {
        const manager = await findManagerByUserId(user.id)
        if(!manager) {
            res.json({ success: false, message: "Kompanie ble opprettet men du ble ikke lagt til som leder." })
            return
        }

        await addManagerToCompanie(companie.id, manager.id)
    }

    res.json({ success: true, message: "Kompaniet ble opprettet.", data: companie });
})

app.post("/api/companie/manager/add", async (req, res) => {
    const { companieId, managerId } = req.body
    const companie = await findCompanieById(companieId);
    
    if(companie) {
        await addManagerToCompanie(companieId, managerId)
        res.json({ success: true, message: "Manageren ble lagt til." });
    } else {
        res.json({ success: false, message: "Kompaniet eksisterer ikke." });
    }
})

app.post("/api/companie/id", async (req, res) => {
    const token = req.cookies.token
    const { companieId } = req.body

    const user = await findUserByToken(token)
 
    if(!user) {
        res.json({ success: false, message: "Bruker ble ikke funnet.", redirect: "/auth" })
        return
    } else if (user.role == $Enums.Role.MEMBER || user.role == $Enums.Role.PARRENT) {
        res.json({ success: false, message: "Bruker er ikke manager.", redirect: "/" })
        return
    }


    const companieManagers = await findCompanieManagerById(companieId);
    const manager = await findManagerByUserId(user.id);

    if(!manager) {
        res.json({ success: false, message: "Bruker mangler manager data.", redirect: "/dashboard" })
        return
    } else if(!companieManagers) {
        res.json({ success: false, message: "Kompaniet ble ikke funnet.", redirect: "/dashboard" })
        return
    } else if (companieManagers.managers.some(m => m.id === manager.id) == false) {
        res.json({ success: false, message: "Bruker har ikke tilgang til Kompaniet.", redirect: "/dashboard" })
        return
        
    } else {
        const companie = await findManagersCompanieById(companieId)
        res.json({ success: true, data: companie })
        return
    }
})

app.post("/api/companie/edit", async (req, res) => {
    const { companieId, name } = req.body
    const token = req.cookies.token
    const user = await findUserByToken(token)

    if(!user) {
        res.json({ success: false, message: "Bruker ble ikke funnet.", redirect: "/auth" })
        return
    } else if (user.role == $Enums.Role.MEMBER || user.role == $Enums.Role.PARRENT) {
        res.json({ success: false, message: "Bruker er ikke manager.", redirect: "/" })
        return
    }

    await editCompanie(companieId, name).catch((e) => {
        res.json({ success: false, message: "Kompaniet ble ikke oppdatert." })
    })


    res.json({ success: true, message: "Kompaniet ble oppdatert." })
})

app.post("/api/companie/delete", async (req, res) => {
    const { companieId } = req.body
    const token = req.cookies.token
    const user = await findUserByToken(token)

    if(!user) {
        res.json({ success: false, message: "Bruker ble ikke funnet.", redirect: "/auth" })
        return
    } else if (user.role == $Enums.Role.MEMBER || user.role == $Enums.Role.PARRENT) {
        res.json({ success: false, message: "Bruker er ikke manager.", redirect: "/" })
        return
    }

    await deleteCompanie(companieId).catch((e) => {
        console.log(e)
        res.json({ success: false, message: "Kompaniet ble ikke slettet." })
    })

    res.json({ success: true, message: "Kompaniet ble slettet." })
}) 
 
app.get("/api/companie/token", async (req, res) => {
    const token = req.cookies.token
    const user = await findUserByToken(token)

    if(!user) {
        res.json({ success: false, message: "Bruker ble ikke funnet.", redirect: "/auth" })
        return
    } else if (user.role == $Enums.Role.MEMBER || user.role == $Enums.Role.PARRENT) {
        res.json({ success: false, message: "Bruker er ikke manager.", redirect: "/" })
        return
    } else if (user.role == $Enums.Role.ADMIN) {
        const companies = await getAllCompanies()
        res.json({ success: true, data: companies })
        return
    }


    const companie = await findCompaniesByUserId(user.id)
    if(!companie) {
        res.json({ success: true, message: "Bruker har har ingen kopmanier."})
        return
    }

    res.json({ success: true, data: companie.companies })
    return
})

/* Platoon api calls */
app.post("/api/platoon/create", async (req, res) => {
    const body = req.body as Platoon

    const platoon =  await createPlatoon(body).catch((e) => {
        console.log(e);
        res.json({ success: false, message: "Palaton ble ikke opprettet." });
    })

    if(!platoon) return
    res.json({ success: true, message: "Palaton ble opprettet.", data: platoon });
})

app.get("/api/platoon/token", async (req, res) => { 
    const token = req.cookies.token

    const user = await findUserByToken(token)

    if(!user) {
        res.json({ success: false, message: "Bruker ble ikke funnet.", redirect: "/auth" });
        return
    }

    if(user.role !== $Enums.Role.MEMBER) {
        res.json({ success: false, message: "Bruker er ikke medlem.", redirect: "/dashboard" });
        return
    }

    const member = await findPlatoonIdByUserId(user.id)
    if(member) {
        const platoon = await findPlatoonById(member.platoon.id);
        const managers = await findManagersPersonalByCompanieId(platoon?.companieId!);

        res.json({
            success: true,
            data: {
                name: platoon?.name,
                membersWithParrents: platoon?.members,
                managers: managers?.managers 
            }
        })
    } else {
        res.json({ success: false, message: "Palaton ble ikke funnet.", redirect: "/" });
    }
})

app.post("/api/platoon/id", async (req, res) => {
    const time = Date.now()

    const { platoonId } = req.body
    const token = req.cookies.token
    
    const user = await findUserByToken(token)

    if(!user) {
        res.json({ success: false, message: "Bruker ble ikke funnet.", redirect: "/auth" });
        return
    } else if(user.role == $Enums.Role.MEMBER || user.role == $Enums.Role.PARRENT) {
        res.json({ success: false, message: "Bruker har ikke tilgang.", redirect: "/" });
        return
    }

    const platoon = await findPlatoonById(platoonId);

    if(platoon) { 
        const managers = await findManagersPersonalByCompanieId(platoon?.companieId)


        res.json({ 
            success: true, 
            data: {
                name: platoon.name,
                managers: managers?.managers,
                membersWithParrents: platoon.members,
            }
        })
    } else {
        res.json({ success: false, message: "Palaton ble ikke funnet.", redirect: "/dashboard/companie" });
    }
})

app.post("/api/platoon/edit", async (req, res) => {
    const { platoonId, name } = req.body
    const token = req.cookies.token
    
    const user = await findUserByToken(token)

    if(!user) {
        res.json({ success: false, message: "Bruker ble ikke funnet.", redirect: "/auth" });
        return
    } else if(user.role == $Enums.Role.MEMBER || user.role == $Enums.Role.PARRENT) {
        res.json({ success: false, message: "Bruker har ikke tilgang.", redirect: "/" });
        return
    }

    editPlatoon(platoonId, name).catch((e) => {
        console.log(e);
        res.json({ success: false, message: "Palaton ble ikke funnet.", redirect: "/dashboard/companie" });
    })

    res.json({ success: true, message: "Palaton ble oppdatert." });
})

app.post("/api/platoon/delete", async (req, res) => {
    const { platoonId } = req.body
    const token = req.cookies.token
    
    const user = await findUserByToken(token)

    if(!user) {
        res.json({ success: false, message: "Bruker ble ikke funnet.", redirect: "/auth" });
        return
    } else if(user.role == $Enums.Role.MEMBER || user.role == $Enums.Role.PARRENT) {
        res.json({ success: false, message: "Bruker har ikke tilgang.", redirect: "/dashboard/platoon" });
        return
    }
    
    const platoon = await findPlatoonDataForDelete(platoonId)
    if(!platoon) {
        res.json({ success: false, message: "Palaton ble ikke funnet.", redirect: "/dashboard/companie" });
        return
    } else if(platoon.members.length > 0) {
        res.json({ success: false, message: "Alle medlem må flyttes fra Palatongen!", redirect: "/dashboard/companie" });
        return
    }

    deletePlatoon(platoonId)
    res.json({ success: true, message: "Palatong ble slettet" });
})

/* Admin api calls */
app.get("/api/admin/dashboard", async (req, res) => {
    const token = req.cookies.token
    const user = await findUserByToken(token)

    if(!user) {
        res.json({ success: false, message: "Bruker ble ikke funnet.", redirect: "/auth" });
        return
    } else if(user.role !== $Enums.Role.ADMIN) {
        res.json({ success: false, message: "Bruker er ikke admin.", redirect: "/" });
        return
    }

    const companies = await getAllCompanies()
    const platoons = await getAllPlatoons()
    const users = await getAllUsers()
    const managers = await getAllManagers()
    const members = await getAllMembers()
    const parrents = await getAllParrents()    

    res.json({ success: true, data: { companies, platoons, users, managers, members, parrents } });


})

app.get("/api/admin/companies", async (req, res) => {
    const token = req.cookies.token
    const user = await findUserByToken(token)

    if(!user) {
        res.json({ success: false, message: "Bruker ble ikke funnet.", redirect: "/auth" });
        return
    } else if(user.role !== $Enums.Role.ADMIN) {
        res.json({ success: false, message: "Bruker er ikke admin.", redirect: "/" });
        return
    }

    const companies = await getAllCompanies()

    res.json({ success: true, data: companies });


})

app.post("/api/admin/managerCompanies", async (req, res) => {
    const token = req.cookies.token
    const { userId } = req.body

    const user = await findUserByToken(token)
 
    if(!user) {
        res.json({ success: false, message: "Bruker ble ikke funnet.", redirect: "/auth" })
        return
    } else if (user.role !== $Enums.Role.ADMIN) {
        res.json({ success: false, message: "Bruker er ikke Admin.", redirect: "/" })
        return
    }


    const manager = await findManagerByUserId(userId)

    if(!manager) {
        res.json({ success: false, message: "Bruker mangler manager data.", redirect: "/dashboard" })
        return
    } else {
        const companieManagers = await findCompaniesByManagerId(manager.id);

        res.json({ success: true, data: companieManagers })
        return
    }
})
 
app.post("/api/admin/manager/removeCompanie", async (req, res) => {
    const token = req.cookies.token
    const { managerId, companieId } = req.body

    const user = await findUserByToken(token)
 
    if(!user) {
        res.json({ success: false, message: "Bruker ble ikke funnet.", redirect: "/auth" })
        return
    } else if (user.role !== $Enums.Role.ADMIN) {
        res.json({ success: false, message: "Bruker er ikke Admin.", redirect: "/" })
        return
    }


    const manager = await removeCompanieFromManager(managerId, companieId)
    res.json({ success: true })
})