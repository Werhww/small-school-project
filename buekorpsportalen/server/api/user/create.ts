import { type User } from "@prisma/client"
import { createUser } from "~/server/prisma"

export default defineEventHandler(async (event) => {
    const body = await readBody(event) as User
    
    return createUser(body)
})