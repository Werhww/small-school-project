import { PrismaClient, type User, type Personal, type Parrent, type Member, type Companie, type Manager } from '@prisma/client'
const prisma = new PrismaClient()

export async function allUsers() {
    return await prisma.user.findMany()
}

export async function createUser(user:User) {
    return await prisma.user.create({
        data: user
    })
}

export async function deleteUser(user:User) {
    return await prisma.user.delete({
        where: {
            id: user.id
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

export async function addPersonalToUser(personal:Personal) {
    return await prisma.personal.create({
        data: personal
    })
}

export async function changePersonal(personal:Personal) {
    return await prisma.personal.update({
        where: {
            id: personal.id
        },
        data: personal
    })
}

export async function addParrentToUser(parrent:Parrent) {
    return await prisma.parrent.create({
        data: parrent
    })
}

export async function addChildToParrent(parrent:Parrent, childId:number) {
    return await prisma.parrent.update({
        where: {
            id: parrent.id
        },
        data: {
            childern: {
                connect: {
                    id: childId
                }
            }
        }
    })
}

export async function addMemberToUser(member:Member) {
    return await prisma.member.create({
        data: member
    })
}

export async function changeMember(member:Member) {
    return await prisma.member.update({
        where: {
            id: member.id
        },
        data: member
    })
}

export async function addManagerToUser(manager:Manager) {
    return await prisma.manager.create({
        data: manager
    })
}

export async function changeManager(manager:Manager) {
    return await prisma.manager.update({
        where: {
            id: manager.id
        },
        data: manager
    })
}

export async function addCompanieToUser(companieId:number, user:User) {
    return await prisma.manager.update({
        where: {
            userId: user.id
        },
        data: {
            companie: {
                connect: {
                    id: companieId
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

export async function changeCompanie(companie:Companie) {
    return await prisma.companie.update({
        where: {
            id: companie.id
        },
        data: companie
    })
}

