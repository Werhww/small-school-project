import { User } from "@prisma/client"
import { findUserByPassword } from "~/server/prisma"
import { sha256 } from "~/utils/utils"

export default defineEventHandler(async (event) => {
    const body = await readBody(event) as User
    const userData = await findUserByPassword(sha256(body.password))

    if(userData == null) return null
    
    setCookie(event, "token", userData.token, { maxAge: 60 * 60 * 24 * 7 })
    return userData
})