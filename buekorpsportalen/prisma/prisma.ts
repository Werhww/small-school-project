import { PrismaClient, type User, type Personal, type Parrent, type Member, type Companie, type Manager } from '@prisma/client'
const prisma = new PrismaClient()

export async function createUser(user:User) {
    return await prisma.user.create({
        data: user
    })
}

export async function createManager(userId:number) {
    return await prisma.manager.create({
        data: {
            userId: userId
        }
    })
}

export async function createParrent(userId:number) {
    return await prisma.parrent.create({
        data: {
            userId: userId
        }
    })
}

export async function addPlatoonToUser(userId:number, platoonId:number) {
    return await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            member: {
                create: {
                    platoonId: platoonId
                }
            }
        }
    })
}

export async function findUserByPassword(password:string) {
    return await prisma.user.findUnique({
        where: {
            password: password
        }
    })
}

export async function findUserByToken(token:string) {
    return await prisma.user.findFirst({
        where: {
            token: token
        }
    })
}

export async function findUserById(id:number) {
    return await prisma.user.findUnique({
        where: {
            id: id
        }
    })
}

export async function findPlatoonByMembersToken(token:string) {
    return await prisma.user.findFirst({
        where: {
            token: token
        },
        include: {
            member: {
                include: {
                    platoon: true
                }
            }
        }
    })
}

export async function createCompanie(companie:Companie) {
    return await prisma.companie.create({
        data: companie
    })
}