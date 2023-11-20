import { allUsers } from "~/server/prisma"

export default defineEventHandler(async (event) => {
    return await allUsers()
})