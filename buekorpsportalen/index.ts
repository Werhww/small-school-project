import express from "express"
import { join } from "path"
import { sha256 } from "./utils";
import cookieParser from "cookie-parser";
import { User } from "@prisma/client";
import { findUserByPassword } from "./prisma/prisma";

const app = express();

app.use(express.json());
app.use(express.static(join(__dirname, "public")));
app.use(cookieParser());

app.listen(3000, () => {
    console.log("http://localhost:3000");
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