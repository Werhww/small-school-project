import express from "express"
import { join } from "path"

const app = express();

app.use(express.json());
app.use(express.static(join(__dirname, "public")));

app.listen(3000, () => {
    console.log("http://localhost:3000");
})

