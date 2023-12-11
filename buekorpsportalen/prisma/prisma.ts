import { PrismaClient, type User, type Personal, type Parrent, type Member, type Companie, type Manager, Platoon } from "@prisma/client"
const prisma = new PrismaClient()

export async function createUser(user:User) {
    return await prisma.user.create({
        data: user
    })
}

export async function deleteUser(id:number) {
    return await prisma.user.delete({
        where: {
            id: id
        }
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

export async function updateMember(userId:number, platoonId:number) {
    return await prisma.member.update({
        where: {
            userId: userId
        },
        data: {
            platoonId: platoonId
        }
    })
}

export async function addPersonalToUser(userId:number, personal:Personal) {
    return await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            personal: {
                create: personal
            }
        }
    })

}

export async function updatePersonal(personalId:number, personal:Personal) {
    return await prisma.personal.update({
        where: {
            id: personalId
        },
        data: {
            firstName: personal.firstName,
            lastName: personal.lastName,
            birthDate: personal.birthDate,
            email: personal.email,
            phone: personal.phone,
            address: personal.address,
            city: personal.city,
            postalCode: personal.postalCode
        }
    })

}

export async function findPersonalByUserId(userId:number) {
    return await prisma.personal.findFirst({
        where: {
            userId: userId
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            birthDate: true,                             
            email: true,
            phone: true,
            picture: false,                           
            address: true,                           
            city: true,                          
            postalCode: true,                   
        }
    })

}

export async function findPictureByPersonalId(personalId:number) {
    return await prisma.personal.findFirst({
        where: {
            id: personalId
        },
        select: {
            picture: true
        }
    })


}

export async function addImageToUser(userId:number, picture:Buffer) {
    return await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            personal: {
                update: {
                    picture: picture
                }
            }
        }
    })

}

export async function addParrentToUser(userId:number, parrentId:number) {
    return await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            member: {
                update: {
                    parrents: {
                        connect: {
                            id: parrentId
                        }
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

export async function findManagerByUserId(userId:number) {
    return await prisma.manager.findFirst({
        where: {
            userId: userId
        },
        select: {
            id: true,
        }
    })
}

export async function removeCompanieFromManager(managerId:number, companieId:number) {
    return await prisma.manager.update({
        where: {
            id: managerId
        },
        data: {
            companies: {
                disconnect: {
                    id: companieId
                }
            }
        }
    })
    
}

export async function findPlatoonIdByUserId(userId:number) {
    return await prisma.member.findUnique({
        where: {
            userId: userId
        },
        select: {
            platoon: {
                select: {
                    id: true,
                }
            }
        },

    })
}

export async function findPlatoonById(id:number) {
    return await prisma.platoon.findUnique({
        where: {
            id: id
        },
        include: {
            members: {
                select: {
                    user: {
                        select: {
                            id: true,
                            personal: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    birthDate: true,                             
                                    email: true,
                                    phone: true,
                                    picture: false,                           
                                    address: true,                           
                                    city: true,                          
                                    postalCode: true,                           
                                }
                            }
                        }
                    },
                    parrents: {
                        select: {
                            user: {
                                select: {
                                    id: true,
                                    personal: {
                                        select: {
                                            id: true,
                                            firstName: true,
                                            lastName: true,
                                            birthDate: true,                             
                                            email: true,
                                            phone: true,
                                            picture: false,                           
                                            address: true,                           
                                            city: true,                          
                                            postalCode: true,                           
                                        }
                                    }
                                }
                            }
                        }
                    }
                
                }
            },
        }
    })
}

export async function createCompanie(companie:Companie) {
    return await prisma.companie.create({
        data: companie
    })
}

export async function editCompanie(id:number, name:string) {
    return await prisma.companie.update({
        where: {
            id: id
        },
        data: {
            name: name
        }
    })
}

export async function deleteCompanie(id:number) {
    return await prisma.companie.delete({
        where: {
            id: id
        }
    })

}

export async function findCompanieById(id:number) {
    return await prisma.companie.findUnique({
        where: {
            id: id
        }
    })

}

export async function findManagersCompanieById(companieId:number) {
    return await prisma.companie.findUnique({
        where: {
            id: companieId
        },
        select: {
            id: true,
            name: true,
            platoons: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    })
}

export async function findCompaniesByManagerId(managerId:number) {
    return await prisma.manager.findUnique({
        where: {
            id: managerId
        },
        select: {
            id: true,
            companies: true
        }
    })
}

export async function findManagersPersonalByCompanieId(companieId:number) {
    return await prisma.companie.findUnique({
        where: {
            id: companieId
        },
        select: {
            managers: {
                select: {
                    user: {
                        select: {
                            id: true,
                            personal: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    birthDate: true,                             
                                    email: true,
                                    phone: true,
                                    picture: false,                           
                                    address: true,                           
                                    city: true,                          
                                    postalCode: true,                           
                                }
                            }
                        }
                    }
                }
            }
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

export async function findCompanieManagerById(companieId:number) {
    return await prisma.companie.findFirst({
        where: {
            id: companieId
        },
        select: {
            managers: {
                select: {
                    id: true,
                }
            }
        }
    })

}

export async function findCompaniesByUserId(userId:number) {
    return await prisma.manager.findUnique({
        where: {
            userId: userId
        },
        select: {
            companies: true
        }
    })
}

export async function createPlatoon(platoon:Platoon) {
    return await prisma.platoon.create({
        data: platoon
    })
}

export async function editPlatoon(id:number, name:string) {
    return await prisma.platoon.update({
        where: {
            id: id
        },
        data: {
            name: name
        }
    })
}

export async function deletePlatoon(id:number) {
    return await prisma.platoon.delete({
        where: {
            id: id
        }
    })
}

export async function findPlatoonDataForDelete(id:number) {
    return await prisma.platoon.findUnique({
        where: {
            id: id
        },
        select: {
            members: true
        }
    })
}

/* Admin data fetchers */
export async function getAllCompanies() {
    return await prisma.companie.findMany()
}

export async function getAllPlatoons() {
    return await prisma.platoon.findMany()
}

export async function getAllUsers() {
    return await prisma.user.findMany({
        include: {
            personal: {
                select: {
                    firstName: true,
                    lastName: true,
                    birthDate: true,                             
                    email: true,
                    phone: true,
                    picture: false,                           
                    address: true,                           
                    city: true,                          
                    postalCode: true,                           
                }
            }
        }
    })
}

export async function getAllManagers() {
    return await prisma.manager.findMany({
        include: {
            companies: true
        }
    })
}

export async function getAllParrents() {
    return await prisma.parrent.findMany()
}

export async function getAllMembers() {
    return await prisma.member.findMany()
}