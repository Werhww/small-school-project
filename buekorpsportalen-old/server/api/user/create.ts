import { type User } from "@prisma/client"
import { createUser } from "~/server/prisma"
import { sha256 } from "~/utils/utils"

export default defineEventHandler(async (event) => {
    const body = await readBody(event) as User 
    return await createUser({
        ...body,
        password: sha256(body.password)
    })
})