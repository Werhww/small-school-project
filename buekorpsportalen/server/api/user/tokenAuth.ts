import { User } from "@prisma/client"
import { findUserByToken } from "~/server/prisma"

export default defineEventHandler(async (event) => {
    const body = await readBody(event) as User
    return await findUserByToken(body.token)
})  