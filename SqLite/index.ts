import express from 'express'
import { PrismaClient, User } from '@prisma/client';
import { join } from 'path';

const prisma = new PrismaClient();

const app = express();
const port = 3000;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(join(__dirname, 'public')))



app.listen(port, () => {
    console.log(`http://localhost:${port}/`);
})

app.get('/', (req, res) => {
    res.sendFile('/index.html');
});


app.get('api/users', (req, res) => {
    const body = req.body as User

    const user = prisma.user.create({
        data: body
    })

    res.json(user);
});