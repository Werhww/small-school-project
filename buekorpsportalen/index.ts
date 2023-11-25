import express from "express"
import { join } from "path"
import { sha256 } from "./utils";
import cookieParser from "cookie-parser";
import { $Enums, Companie, User } from "@prisma/client";
import { addPlatoonToUser, createManager, createParrent, createUser, findPlatoonByMembersToken, findUserById, findUserByPassword, findUserByToken } from "./prisma/prisma";

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
        res.cookie("token", user.token, { maxAge: 60*60*24*7, httpOnly: true});
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

app.post("/api/companie/create", async (req, res) => {
    const body = req.body as Companie
    
    
})

app.post("/api/platoon/addUser", async (req, res) => {
    const { userId, platoonId } = req.body
    const user = await findUserById(userId);

    if (user) {
        await addPlatoonToUser(userId, platoonId);
        res.json({ success: true, message: "Brukeren ble oppdatert." });
    } else {
        res.json({ success: false, message: "Brukeren eksisterer ikke." });
    }
})

app.post("/api/platoon/create", async (req, res) => {
    const { userId, platoonId } = req.body
    const user = await findUserById(userId);

    if (user) {
        await addPlatoonToUser(userId, platoonId);
        res.json({ success: true, message: "Brukeren ble oppdatert." });
    } else {
        res.json({ success: false, message: "Brukeren eksisterer ikke." });
    }
})


app.get("/api/platoon/members", async (req, res) => {
    const token = req.cookies.token
    const userWithPlatoon = await findPlatoonByMembersToken(token);

})