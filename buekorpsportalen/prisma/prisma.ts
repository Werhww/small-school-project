import { PrismaClient, type User, type Personal, type Parrent, type Member, type Companie, type Manager, Platoon } from '@prisma/client'
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
                connectOrCreate: {
                    where: {
                        userId: userId,
                    },
                    create: {
                        platoonId: platoonId
                    }
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
        select: {
            member: {
                select: {
                    platoon: {
                        select: {
                            name: true,
                            members: {
                                select: {
                                    user: {
                                        select: {
                                            id: true,
                                            personal: true
                                        }
                                    },
                                    parrents: {
                                        select: {
                                            user: {
                                                select: {
                                                    id: true,
                                                    personal: true
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            companie: {
                                select: {
                                    managers: {
                                        include: {
                                            user: {
                                                select: {
                                                    id: true,
                                                    personal: true
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },

            },
        }
    })
}

export async function findPlatoonById(id:number) {
    return await prisma.platoon.findUnique({
        where: {
            id: id
        },
        select: {
            name: true,
            companieId: true,
            members: {
                select: {
                    user: {
                        select: {
                            id: true,
                            personal: true
                        }
                    },
                    parrents: {
                        select: {
                            user: {
                                select: {
                                    id: true,
                                    personal: true
                                }
                            }
                        }
                    }
                
                }
            },
            companie: {
                select: {
                    managers: {
                        select: {
                            user: {
                                select: {
                                    id: true,
                                    personal: true
                                }
                            }
                        }
                    }
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

export async function findCompanieById(id:number) {
    return await prisma.companie.findUnique({
        where: {
            id: id
        }
    })

}

export async function addManagerToCompanie(companieId:number, managerId:number) {
    return await prisma.companie.update({
        where: {
            id: companieId
        },
        data: {
            managers: {
                connect: {
                    id: managerId
                }
            }
        }
    })

}

export async function createPlatoon(platoon:Platoon) {
    return await prisma.platoon.create({
        data: platoon
    })
}