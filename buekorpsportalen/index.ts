import express from "express"
import multer from "multer";
import { join } from "path"
import { sha256 } from "./utils";
import cookieParser from "cookie-parser";
import { $Enums, Companie, Personal, Platoon, User } from "@prisma/client";
import { addImageToUser, addManagerToCompanie, addPersonalToUser, addPlatoonToUser, createCompanie, createManager, createParrent, createPlatoon, createUser, findCompanieById, findPlatoonById, findPlatoonByMembersToken, findUserById, findUserByPassword, findUserByToken } from "./prisma/prisma";

const app = express()
const upload = multer()

app.use(express.json({ limit: "50mb" }))
app.use(express.static(join(__dirname, "public")));
app.use(cookieParser());
 
app.listen(3000, () => {
    console.log("http://localhost:3000");
})

app.get("/", (req, res) => {
    const token = req.cookies.token

    if (token) {
        res.redirect("/dashboard");
    } else {
        res.redirect("/auth");
    }
})

app.post("/api/auth", async (req, res) => {
    const { password } = req.body as User
    const hash = sha256(password);
    
    const user = await findUserByPassword(hash);

    console.log(user);

    if (user) {
        res.cookie("token", user.token, { maxAge: 1000*60*60*60*24*7, httpOnly: true  });
        res.json({ success: true });
    } else {
        res.json({ success: false, message: "Feil passord." });
    }
})

app.post("/api/user/create", async (req, res) => {
    const body = req.body as User
    const hash = sha256(body.password);

    const user = await findUserByPassword(hash);

    if (user) {
        console.log("Brukeren eksisterer allerede.");
        res.json({ success: false, message: "Brukeren eksisterer allerede." });
    } else {
        console.log("Brukeren ble opprettet.");
        const user = await createUser({ ...body, password: hash })

        if(body.role === $Enums.Role.MANAGER) {
            await createManager(user.id)
        }

        if(body.role === $Enums.Role.PARRENT) {
            await createParrent(user.id)
        }
        
        res.json({ success: true, message: "Brukeren ble opprettet." });
    }
})

app.post("/api/user/connectToPlatoon", async (req, res) => {
    const { userId, platoonId } = req.body
    const user = await findUserById(userId);

    if (user) {
        if(user.role !== $Enums.Role.MEMBER) {
            res.json({ success: false, message: "Brukeren er ikke et medlem." });
            return
        }

        await addPlatoonToUser(userId, platoonId);
        res.json({ success: true, message: "Brukeren ble oppdatert." });
    } else {
        res.json({ success: false, message: "Brukeren eksisterer ikke." });
    }
}) 

app.post("/api/user/addPersonal", async (req, res) => {
    const body = req.body as Personal
    const token = req.cookies.token
    const user = await findUserByToken(token);

    if (user) {
        await addPersonalToUser(user.id, body);
        res.json({ success: true, message: "Brukeren ble oppdatert." });
    } else {
        res.json({ success: false, message: "Brukeren eksisterer ikke." });
    }
})

app.post("/api/user/addImage", upload.single('picture'), async (req, res) => {
    const buffer = req.file?.buffer
    const token = req.cookies.token
    const user = await findUserByToken(token);

    if (user) {
        if(!buffer) {
            res.json({ success: false, message: "Bilde ble ikke funnet." });
            return
        }
        await addImageToUser(user.id, buffer)
        res.json({ success: true, message: "Brukeren ble oppdatert." });
    } else {
        res.json({ success: false, message: "Brukeren eksisterer ikke." });
    }
})

app.post("/api/companie/create", async (req, res) => {
    const body = req.body as Companie

    const companie = await createCompanie(body);
    res.json({ success: true, message: "Kompaniet ble opprettet.", data: { companie } });
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

app.post("/api/platoon/create", async (req, res) => {
    const body = req.body as Platoon

    await createPlatoon(body)
    res.json({ success: true, message: "Palaton ble opprettet." });
})

app.get("/api/platoon/token", async (req, res) => { 
    const token = req.cookies.token
    const user = await findUserByToken(token)

    if(user == null || user.role !== $Enums.Role.MEMBER) {
        res.json({ success: false, message: "Bruker er ikke medlem." });
        return
    }

    const userWithPlatoon = await findPlatoonByMembersToken(token);
    
    if(userWithPlatoon) {
        res.json({
            success: true,
            data: {
                name: userWithPlatoon.member?.platoon.name,
                membersWithParrents: userWithPlatoon.member?.platoon.members,
                managers: userWithPlatoon.member?.platoon.companie.managers 
            }
        })
    } else {
        res.json({ success: false, message: "Palaton ble ikke funnet." });
    }

})

app.get("/api/platoon/id", async (req, res) => {
    const { platoonId } = req.body

    const platoon = await findPlatoonById(platoonId);
    
    if(platoon) {
        res.json({ 
            success: true, 
            data: {
                name: platoon.name,
                companieId: platoon.companieId,
                managers: platoon.companie.managers,
                membersWithParrents: platoon.members,
            }
        });
    } else {
        res.json({ success: false, message: "Palaton ble ikke funnet." });
    }

})