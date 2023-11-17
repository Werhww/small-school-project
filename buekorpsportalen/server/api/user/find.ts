import { User } from "@prisma/client"
import { findUserById } from "~/server/prisma"

export default defineEventHandler(async (event) => {
    const body = await readBody(event) as User
    return await findUserById(body.id)
})