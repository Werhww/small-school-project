import express from "express"
import cookieParser from "cookie-parser"
import { PrismaClient, User } from "@prisma/client"

import { join } from "path"
import { createHash } from "crypto"


const app = express()
const port = 3000

const prisma = new PrismaClient()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

function getFile(filename: string) {
    return join(__dirname, "public", filename)
}

function sha256(input: string) {
    const hash = createHash("sha256")
    hash.update(input)
    return hash.digest("hex")
}

app.listen(port, () => {
    console.log(`http://localhost:${port}/`)
})

app.get("/", (req, res) => {
    const token = req.cookies.token
    if(!token) return res.redirect("/auth")

    res.sendFile(getFile("index.html"))
})
app.get("/auth", (req, res) => {

    res.sendFile(getFile("auth.html"))
})


app.post("/api/login", (req, res) => {
    const body = req.body as User
    const user = prisma.user.findUnique({
        where: {
            email: body.email,
            password: sha256(body.password)
        }
    })    

    if(!user) return res.status(401).send("Invalid email or password")

    res.cookie("token", user.token)
    res.redirect("/")
})

app.post("/api/register", (req, res) => {

})