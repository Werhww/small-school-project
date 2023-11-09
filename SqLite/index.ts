import express from "express"
import { PrismaClient, User, Post } from "@prisma/client";
import { join } from "path";

const prisma = new PrismaClient();

const app = express();
const port = 3000;

const publicFiles = join(__dirname, "public");

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.listen(port, () => {
    console.log(`http://localhost:${port}/`);
})

app.get("/", (req, res) => {
    res.sendFile(join("index.html"), {root: publicFiles});
});

app.get("/script.js", (req, res) => {  
    res.sendFile(join("script.js"), {root: publicFiles}) 
});


app.post("/api/user", async (req, res) => {
    const body = req.body as User

    const user = await prisma.user.create({
        data: body
    }).catch((err) => {
        res.status(500).json(err)
    })

    console.log(user, body)

    res.json(user)
})

app.post("/api/post", async (req, res) => {
    const body = req.body as Post
    
    const post = await prisma.post.create({
        data: {
            authorId: Number(body.authorId),
            title: body.title,
        }
    }).catch((err) => {
        res.status(500).json(err)
        console.log(err)
    })

    console.log(post, body)

    res.json(post)
})