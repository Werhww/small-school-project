import { PrismaClient, type User, type Personal, type Parrent, type Member, type Companie, type Manager } from '@prisma/client'
const prisma = new PrismaClient()

export function createUser(user:User) {
    return prisma.user.create({
        data: user
    })
}

export function addUserPersonalInfo(user:User, personal:Personal) {
    return prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            personal: {
                create: personal
            }
        }
    })
}

export function addUserParrentInfo(user:User, parrent:Parrent) {
    return prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            parrent: {
                create: parrent
            }
        }
    })
}

export function addUserMemberInfo(user:User, member:Member) {
    return prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            member: {
                create: member
            }
        }
    })
}

export function addUserManagerInfo(user:User, manager:Manager) {
    return prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            manager: {
                create: manager
            }
        }
    })

}

export function addManagerToCompanie(manager:Manager, Companie:Companie) {
    return prisma.manager.update({
        where: {
            id: manager.id
        },
        data: {
            companie: {
                connectOrCreate: {
                    where: {
                        id: Companie.id
                    },
                    create: Companie
                }
            }
        }
    })

}

export function deleteUser(user:User) {
    return prisma.user.delete({
        where: {
            id: user.id
        }
    })
}