import { User } from "@prisma/client"
import { findUserByPassword } from "~/server/prisma"
import { sha256 } from "~/utils/utils"

export default defineEventHandler(async (event) => {
    const body = await readBody(event) as User
    return await findUserByPassword(sha256(body.password))
})