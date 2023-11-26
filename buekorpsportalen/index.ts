import express from "express"
import { join } from "path"
import { sha256 } from "./utils";
import cookieParser from "cookie-parser";
import { $Enums, Companie, Platoon, User } from "@prisma/client";
import { addManagerToCompanie, addPlatoonToUser, createCompanie, createManager, createParrent, createPlatoon, createUser, findCompanieById, findPlatoonByMembersToken, findUserById, findUserByPassword } from "./prisma/prisma";

const app = express();

app.use(express.json());
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

app.post("/api/companie/create", async (req, res) => {
    const body = req.body as Companie

    const companie = await createCompanie(body);
    res.json({ success: true, message: "Kompaniet ble opprettet.", companie });
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

app.get("/api/platoon", async (req, res) => {
    const token = req.cookies.token

    const userWithPlatoon = await findPlatoonByMembersToken(token);
    
    if(userWithPlatoon?.role === $Enums.Role.MEMBER) {
        res.json({
            success: true,
            name: userWithPlatoon.member?.platoon.name,
            membersWithParrents: userWithPlatoon.member?.platoon.members,
            managers: userWithPlatoon.member?.platoon.companie.managers
        });
    } else {
        res.json({ success: false, message: "Palaton ble ikke funnet." });
    }

})