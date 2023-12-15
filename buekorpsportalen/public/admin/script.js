const companies = document.getElementById('companies')
const newCompanieButton = document.getElementById('newCompanie')

newCompanieButton.addEventListener("click", async () => {
    const data =  await newCompanie()

    if(data == undefined) return
    if (data.success === false) {
        await alertPopup(data.message)
        return
    }

    createCompani(data.data, [], [], [], [])
})


async function getAllData() {
    console.log("Getting all data")
    const time = new Date()

    const res = await fetch('/api/admin/dashboard')
    const data = await res.json()

    console.log(data)
    console.log("Time: " + ((new Date() - time) / 1000) + "s")

    if (data.success === false) {
        await alertPopup(data.message)
        window.location.href = data.redirect
        return
    }

    for(let i = 0; i < data.data.companies.length; i++) {
        createCompani(data.data.companies[i], data.data.platoons, data.data.members, data.data.users, data.data.managers, data.data.companies, data.data.parrents)
    }

    let createdUsers = []

    for(const user of data.data.users) {
        const foundManager = data.data.managers.find(manager => manager.userId === user.id)
        if (!foundManager) continue
        createdUsers.push(user.id)
        addManager(user, "roleManagerList")
    }

    for(const user of data.data.users) {
        const foundMember = data.data.members.find(member => member.userId === user.id)
        if (!foundMember) continue
        createdUsers.push(user.id)
        addMember(user, "roleMemberList", data.data.companies, data.data.platoons, data.data.members, data.data.parrents, data.data.users)
    }

    for(const user of data.data.users) {
        const foundParrent = data.data.parrents.find(parrents => parrents.userId === user.id)
        if (!foundParrent) continue
        createdUsers.push(user.id)
        addParrent(user, "roleParrentList")
    }

    for(const user of data.data.users) {
        if (createdUsers.includes(user.id)) continue
        if(user.role === "ADMIN") continue
        addMember(user, "roleMemberList", data.data.companies, data.data.platoons, data.data.members, data.data.parrents, data.data.users)
    }
}

getAllData()

function createCompani(comapnie, platoon, members, user, managers, allCompanies, parrents) {
    const wrapper = document.createElement("div")
    wrapper.classList.add("companie")

    const comapnieNameId = `Input${Math.floor(Math.random() * 100000)}`
    const comapnieNameButtonsId = `Buttons${Math.floor(Math.random() * 100000)}`
    const comapniePlatoonsId = `Platoons${Math.floor(Math.random() * 100000)}`

    const comapnieManagerId = `Manager${Math.floor(Math.random() * 100000)}`
    const comapnieManagerListId = `Members${Math.floor(Math.random() * 100000)}`

    wrapper.innerHTML += `
    <div>
        <input type="text" id="${comapnieNameId}" value="${comapnie.name}" disabled>
        <div class="buttons" id="${comapnieNameButtonsId}">
            <button class="normal">Rediger</button>
            <button class="red">Slett</button>
            <button class="green">Legg til Peletong</button>
            <button class="normal">Peletonger</button>
            <button class="normal">Ledere</button>
        </div>
    </div>
    <div class="platoons hidden" id="${comapniePlatoonsId}">
        <h5>Peletonger:</h5>
        <hr>
    </div>
    <div class="platoons hidden" id="${comapnieManagerId}">
        <h5>Ledere:</h5>
        <hr>
        <div class="userList" id="${comapnieManagerListId}"> </div>
    </div>
    <hr>
    `

    function editName(inputId, buttonsId) {
        const input = document.getElementById(inputId)
        const buttons = document.getElementById(buttonsId)

        const oldName = input.value
        const oldButtons = buttons.innerHTML

        input.disabled = false
        input.focus()
        buttons.innerHTML = `
            <button class="normal">Lagre</button>
            <button class="red">Avbryt</button>
        `

        buttons.children[0].addEventListener("click", async () => {
            const data = await request("/api/companie/edit", {
                name: input.value,
                companieId: comapnie.id
            })

            if (data.success === false) {
                alert(data.message)
                input.value = oldName
                cancel()
                return
            }

            cancel()
        })

        buttons.children[1].addEventListener("click", () => {
            input.value = oldName
            cancel()
        })

        function cancel() {
            input.disabled = true
            buttons.innerHTML = oldButtons
            addButtonsFunction()
        }
    }

    companies.appendChild(wrapper)

    function addButtonsFunction() {
        const buttons = document.getElementById(comapnieNameButtonsId).children

        buttons[0].addEventListener("click", () => {
            editName(comapnieNameId, comapnieNameButtonsId)
        })

        buttons[1].addEventListener("click", async () => {
            const deletePopup = await alertPopup("Er du sikker på at du vil slette dette kompaniet?")
    
            if(deletePopup === "close") return
            if(deletePopup === "accept") {
                const data = await request("/api/companie/delete", {
                    companieId: comapnie.id
                })
            
                if (data.success === false) {
                    await alertPopup(data.message)
                    return
                }

                wrapper.remove()
            }
        })

        buttons[2].addEventListener("click", async () => {
            const data = await newPlatoon(comapnie.id, false)
            
            if (data.success === false) {
                await alertPopup(data.message)
                return
            }

            createPlatoon(data.data, comapniePlatoonsId, members, user)
        })

        buttons[3].addEventListener("click", () => {
            const platoonContainer = document.getElementById(comapniePlatoonsId)
            platoonContainer.classList.toggle("hidden")
        })

        buttons[4].addEventListener("click", () => {
            const managerContainer = document.getElementById(comapnieManagerId)
            managerContainer.classList.toggle("hidden")
        })
    }

    for (let i = 0; i < platoon.length; i++) {
        if (platoon[i].companieId === comapnie.id) {
            createPlatoon(platoon[i], comapniePlatoonsId, members, user, platoon, allCompanies, parrents)
        }
    }

    for (let i = 0; i < managers.length; i++) {
        const manager = managers[i]

        const foundCompany = manager.companies.find(company => company.id === comapnie.id)

        if (!foundCompany) continue

        const userIndex = user.findIndex(user => user.id === manager.userId)
        const userData = user[userIndex]
        addManager(userData, comapnieManagerListId)
    }

    addButtonsFunction()
}

function createPlatoon(platoon, comapniePlatoonsId, members, user, allPlatoons, allCompanies, parrents) {
    const wrapper = document.createElement("div")
    wrapper.classList.add("platoon")

    const platoonNameInputId = `Buttons${Math.floor(Math.random() * 100000)}`

    const platoonButtonsId = `Buttons${Math.floor(Math.random() * 100000)}`
    const memberListId = `MemberList${Math.floor(Math.random() * 100000)}`

    wrapper.innerHTML += `
        <div class="mainContent">
            <input type="text" value="${platoon.name}" id="${platoonNameInputId}" disabled>
            <div class="buttons" id="${platoonButtonsId}">
                <button class="normal">Rediger</button>
                <button class="red">Slett</button>
                <button class="normal">Medlem</button>
                <button class="green">Legg til Medlem</button>
            </div>
        </div>
        <div class="userList hidden" id="${memberListId}">
            <h5>Medlem:</h6>
            <hr>            
        </div>
        <hr>
    `

    function editName(inputId, buttonsId) {
        const input = document.getElementById(inputId)
        const buttons = document.getElementById(buttonsId)

        const oldName = input.value
        const oldButtons = buttons.innerHTML

        input.disabled = false
        input.focus()
        buttons.innerHTML = `
            <button class="normal">Lagre</button>
            <button class="red">Avbryt</button>
        `

        buttons.children[0].addEventListener("click", async () => {
            const data = await request("/api/platoon/edit", {
                name: input.value,
                platoonId: platoon.id
            })

            if (data.success === false) {
                alert(data.message)
                input.value = oldName
                cancel()
                return
            }
            cancel()
        })

        buttons.children[1].addEventListener("click", () => {
            input.value = oldName
            cancel()
        })

        function cancel() {
            input.disabled = true
            buttons.innerHTML = oldButtons
            addButtonsFunction()
        }
    }

    document.getElementById(comapniePlatoonsId).appendChild(wrapper)

    function addButtonsFunction() {
        const buttons = document.getElementById(platoonButtonsId).children

        buttons[0].addEventListener("click", () => {
            editName(platoonNameInputId, platoonButtonsId)
        })

        buttons[1].addEventListener("click", async () => {
            const deletePopup = await alertPopup("Er du sikker på at du vil slette denne peletongen?")
    
            if(deletePopup === "close") return
            if(deletePopup === "accept") {
                const data = await request("/api/platoon/delete", { 
                    platoonId: platoon.id 
                })
            
                if (data.success === false) {
                    await alertPopup(data.message)
                    return
                }

                wrapper.remove()
            }

        })

        buttons[2].addEventListener("click", () => {
            const memberContainer = document.getElementById(memberListId)
            memberContainer.classList.toggle("hidden")
        })

        buttons[3].addEventListener("click",async () => {
            const data = await newUser("MEMBER")

            if (data.success == false) return
            const platoonConnectData = await request("/api/user/connectToPlatoon", {
                userId: data.data.id,
                platoonId: platoon.id
            })

            if (platoonConnectData.success === false) {
                await alertPopup(data.message)
                return
            }

            addMember(data.data, memberListId)
            await alertPopup("Bruker vil legge til personlig informasjon ved første innlogging. " + " Ikke glem passordet" + "\n Passord:" + data.password)
        })
    }

    addButtonsFunction() 

    for (let i = 0; i < members.length; i++) {
        if (members[i].platoonId === platoon.id) {
            const userIndex = user.findIndex(user => user.id === members[i].userId)
            const userData = user[userIndex]

            addMember(userData, memberListId, allCompanies, allPlatoons, members, parrents, parrents)
        }
    }
}

function addMember(member, listId, comapnies, platoons, members, parrents, users) {
    const wrapper = document.createElement("div")
    wrapper.classList.add("user")
    const memberButtonsId = `Buttons${Math.floor(Math.random() * 100000)}`

    wrapper.innerHTML += `
        <p>${member?.personal?.firstName} ${member?.personal?.lastName}</p>
        <div class="buttons" id="${memberButtonsId}">
            <button class="normal">Rediger</button>
            <button class="red">Slett</button>
            <button class="normal">Bytt Peletong</button>
            <button class="normal">Endre Foreldre</button>
        </div>
    `
    document.getElementById(listId).appendChild(wrapper)

    const buttons = document.getElementById(memberButtonsId).children

    buttons[0].addEventListener("click", async () => {
        const update = await editPersonal(member)
        if(update.success === false) return

        wrapper.children[0].innerText = `${update.personal.firstName} ${update.personal.lastName}`
    })

    buttons[1].addEventListener("click", async () => {
        const deletePopup = await alertPopup("Er du sikker på at du vil slette denne brukeren?")
    
        if(deletePopup === "close") return
        if(deletePopup === "accept") {
            const data = await request("/api/user/delete", {
                userId: member.id
            })
        
            if (data.success === false) {
                await alertPopup(data.message)
                return
            }

            wrapper.remove()
        }
    })

    buttons[2].addEventListener("click", async () => {
        const newPlatoon = await changePeletong()
        if(newPlatoon === null) return
        console.log(newPlatoon)

        const data = await request("/api/user/changePlatoon", {
            userId: member.id,
            platoonId: newPlatoon
        })

        if(data.success === false) {
            await alertPopup(data.message)
            return
        }

        location.reload()
    })

    buttons[3].addEventListener("click", async () => {
        const { newParrents, startList } = await changeParrents()
        if(newParrents === null) return
        
        const addedParrents = newParrents.filter(newParrent => !startList.find(oldParrent => oldParrent.id === newParrent.id))
        const removedParrents = startList.filter(oldParrent => !newParrents.find(newParrent => newParrent.id === oldParrent.id))

        for(const item of addedParrents) {
            const data = await request("/api/user/connectToParrent", {
                userId: member.id,
                parrentId: item.id
            })
        }

        for(const item of removedParrents) {
            const data = await request("/api/user/disconnectParrent", {
                userId: member.id,
                parrentId: item.id
            })
        }
    })

    function changePeletong() {
        const memberData = members.find(memberData => memberData.userId === member.id)
        let platoonData = null
        let companieData = null
        if(memberData) {
            platoonData = platoons.find(platoonData => platoonData.id === memberData.platoonId)
            companieData = comapnies.find(companieData => companieData.id === platoonData.companieId)
        }

        let alertResolve = null
        let choosenPlatoonId = null

        const alertResponse = new Promise((resolve, reject) => {
            alertResolve = resolve
        })

        const { remove } = overlay(() => {
            alertResolve(null)
            peletongWrapper.remove()
            remove()
        }, true)

        const peletongWrapper = document.createElement("div")
        peletongWrapper.classList.add("changePeletong")

        const title = document.createElement("h4")
        title.innerText = "Endre peletong"

        const selectWrapper = document.createElement("div")
        selectWrapper.classList.add("peletongSelect")

        const display = document.createElement("div")
        const displayTitle = document.createElement("p")
        displayTitle.innerText = "Velg peletong"
        if(memberData) {
            displayTitle.innerText = "Velg peletong - " + companieData.name + " - " + platoonData.name
        }


        const displayImg = document.createElement("img")
        displayImg.src = "../icons/expand.svg"

        display.append(displayTitle, displayImg)
        const options = document.createElement("div")
        options.classList.add("hidden")


        selectWrapper.append(display, options)
    
        display.addEventListener("click", () => {
            options.classList.toggle("hidden")
            display.classList.toggle("companieSelectOpen")
        })

        for(const companie of comapnies) {
            const comapnieTitle = document.createElement("h6")
            comapnieTitle.innerText = companie.name + " - Kompani"
            options.appendChild(comapnieTitle)

            for(const platoon of platoons) {
                if(platoon.companieId !== companie.id) continue

                const platoonTitle = document.createElement("p")
                platoonTitle.innerText = platoon.name

                platoonTitle.addEventListener("click", () => {
                    displayTitle.innerText = `${companie.name} - ${platoon.name}`
                    choosenPlatoonId = platoon.id
                })

                options.appendChild(platoonTitle)
            }
        }

        const buttonWrapper = document.createElement("div")
        buttonWrapper.dataset.row = ""
        buttonWrapper.dataset.gap = ""

        const cancelButton = document.createElement("button")
        cancelButton.innerText = "Avbryt"
        cancelButton.classList.add("button")
        cancelButton.dataset.denied = ""

        cancelButton.addEventListener("click", () => {
            alertResolve(null)
            peletongWrapper.remove()
            remove()
        })

        const saveButton = document.createElement("button")
        saveButton.innerText = "Lagre"
        saveButton.classList.add("button")
        saveButton.dataset.accept = ""

        saveButton.addEventListener("click", async () => {
            alertResolve(choosenPlatoonId)
            peletongWrapper.remove()
            remove()
        })
        
        buttonWrapper.append(cancelButton, saveButton)
        
        peletongWrapper.append(title, selectWrapper, buttonWrapper)

        document.body.appendChild(peletongWrapper)

        return alertResponse
    }

    async function changeParrents() {
        let alertResolve = null
        let allParrents = []
        let parrentList = []
        let startList = []

        for(const parrent of parrents) {
            const user = users.find(user => user.id === parrent.userId)

            allParrents.push({
                id: parrent.id,
                name: user.personal.firstName + " " + user.personal.lastName,
                email: user.personal.email,
                phone: user.personal.phone
            })
        }

        const memberData = members.find((memb) => memb.userId == member.id)
        if(!memberData) {
            await alertPopup("Brukeren må være medlem av en peletong for å ha foreldre.")
            return { newParrents: null, startList: null }
        }

        for(const parrent of memberData.parrents) {
            const user = users.find(user => user.id === parrent.userId)

            parrentList.push({
                id: parrent.id,
                name: user.personal.firstName + " " + user.personal.lastName,
                email: user.personal.email,
                phone: user.personal.phone
            })
            startList.push({
                id: parrent.id,
                name: user.personal.firstName + " " + user.personal.lastName,
                email: user.personal.email,
                phone: user.personal.phone
            })
        }


        const alertResponse = new Promise((resolve) => {
            alertResolve = resolve
        })

        const { remove } = overlay(() => {
            alertResolve(null)
            parrentWrapper.remove()
            remove()
        }, true)

        const parrentWrapper = document.createElement("div")
        parrentWrapper.classList.add("changeCompanie")

        parrentWrapper.innerHTML = `
            <h4>Endre foreldre</h4>
        `
        /* Celected items */
        const selectedItems = document.createElement("div")

        /* Select componenet */
        const selectWrapper = document.createElement("div")
        selectWrapper.classList.add("peletongSelect")

        const display = document.createElement("div")
        const displayTitle = document.createElement("p")
        displayTitle.innerText = "Velg foreldre "

        const displayImg = document.createElement("img")
        displayImg.src = "../icons/expand.svg"

        display.append(displayTitle, displayImg)
        const optionsWrapper = document.createElement("div")
        optionsWrapper.classList.add("hidden")

        const searchInput = document.createElement("input")
        searchInput.placeholder = "Søk etter foreldre"
        optionsWrapper.appendChild(searchInput)

        const options = document.createElement("div")
        optionsWrapper.appendChild(options)

        selectWrapper.append(display, optionsWrapper)
    
        display.addEventListener("click", () => {
            optionsWrapper.classList.toggle("hidden")
            display.classList.toggle("companieSelectOpen")
        })

        for(const parrent of allParrents) {
            const option = document.createElement("p")
            option.innerText = parrent.name

            option.addEventListener("click", () => {
                const alreadySelected = parrentList.find(item => parrent.id == item.id)
                if(alreadySelected) return
                parrentList.push(parrent)
                addParrent(parrent)
            })

            options.appendChild(option)
        }

        searchInput.addEventListener("input", () => {
            const search = searchInput.value.toLowerCase()
            const filteredParrents = allParrents.filter(parrent => parrent.name.toLowerCase().includes(search))
            const filteredParrentsMail = allParrents.filter(parrent => parrent.email.toLowerCase().includes(search))
            const filteredParrentsPhone = allParrents.filter(parrent => parrent.phone.toLowerCase().includes(search))

            let showdParrents = []
            options.innerHTML = ""

            if(filteredParrents.length >= filteredParrentsMail.length && filteredParrents.length >= filteredParrentsPhone.length) {
                showdParrents = filteredParrents
            } else if(filteredParrentsMail.length >= filteredParrents.length && filteredParrentsMail.length >= filteredParrentsPhone.length) {
                showdParrents = filteredParrentsMail
            } else if(filteredParrentsPhone.length >= filteredParrents.length && filteredParrentsPhone.length >= filteredParrentsMail.length) {
                showdParrents = filteredParrentsPhone
            } 
            
            for(const parrent of showdParrents) {
                const option = document.createElement("p")
                option.innerText = parrent.name

                option.addEventListener("click", () => {
                    const alreadySelected = parrentList.find(item => parrent.id == item.id)
                    if(alreadySelected) return
                    parrentList.push(parrent)
                    addParrent(parrent)
                })

                options.appendChild(option)
            }
        })
    

        /* Buttons */
        const buttonWrapper = document.createElement("div")
        buttonWrapper.dataset.row = ""
        buttonWrapper.dataset.gap = ""

        const cancelButton = document.createElement("button")
        cancelButton.innerText = "Avbryt"
        cancelButton.classList.add("button")
        cancelButton.dataset.denied = ""

        cancelButton.addEventListener("click", () => {
            alertResolve(null)
            parrentWrapper.remove()
            remove()
        })

        const saveButton = document.createElement("button")
        saveButton.innerText = "Lagre"
        saveButton.classList.add("button")
        saveButton.dataset.accept = ""

        saveButton.addEventListener("click", async () => {
            alertResolve(parrentList)
            parrentWrapper.remove()
            remove()
        })
        
        buttonWrapper.append(cancelButton, saveButton)

        parrentWrapper.append(selectedItems, selectWrapper, buttonWrapper)

        function addParrent(parrent) {
            const selecetetParrentWrapper = document.createElement("div")

            selecetetParrentWrapper.innerHTML = `
                <p>${parrent.name}</p>
                <p>X</p>
            `

            selecetetParrentWrapper.addEventListener("click", () => {
                const index = parrentList.findIndex(serchParrent => serchParrent.id === parrent.id)
                parrentList.splice(index, 1)
                selecetetParrentWrapper.remove()
            })

            selectedItems.appendChild(selecetetParrentWrapper)
            
        }

        for(const parrent of parrentList) {
            addParrent(parrent)
        }

        document.body.appendChild(parrentWrapper)
        const newParrents = await alertResponse
        return { newParrents, startList }
    }

}

function addManager(member, listId) {
    const wrapper = document.createElement("div")
    wrapper.classList.add("user")

    const buttonsId = `Buttons${Math.floor(Math.random() * 100000)}`
    const nameId = `Name${Math.floor(Math.random() * 100000)}`

    wrapper.innerHTML += `
        <p id="${nameId}">${member?.personal?.firstName} ${member?.personal?.lastName}</p>
        <div class="buttons" id="${buttonsId}">
            <button class="normal">Rediger</button>
            <button class="red">Slett</button>
            <button class="normal">Bytt Kompani</button>
        </div>
    `
    document.getElementById(listId).appendChild(wrapper)

    const buttons = document.getElementById(buttonsId).children

    buttons[0].addEventListener("click", async () => {
        const newData = await editPersonal(member)
        if (newData.success === false) return

        document.getElementById(nameId).innerText = `${newData.personal.firstName} ${newData.personal.lastName}`
    })

    buttons[1].addEventListener("click", async () => {
        const deletePopup = await alertPopup("Er du sikker på at du vil slette denne brukeren?")
    
        if(deletePopup === "close") return
        if(deletePopup === "accept") {
            const data = await request("/api/user/delete", {
                userId: member.id
            })
        
            if (data.success === false) {
                await alertPopup(data.message)
                return
            }

            wrapper.remove()
        }
    })

    buttons[2].addEventListener("click", async () => {
        const res = await fetch("/api/admin/companies")
        const allCompanies = await res.json()
        const data = await request("/api/admin/managerCompanies", {
            userId: member.id
        })

        const companies = data.data.companies

        if (allCompanies.success === false) {
            await alertPopup(data.message)
            return
        }
        
        if (data.success === false) {
            await alertPopup(data.message)
            return
        }

        const newCompanies = await changeCompanies(allCompanies.data, companies)
        if(newCompanies === null) return

        const addedCompanies = newCompanies.filter(newCompany => !companies.find(oldCompany => oldCompany.id === newCompany.id))
        const removedCompanies = companies.filter(oldCompany => !newCompanies.find(newCompany => newCompany.id === oldCompany.id))

        for(const item of addedCompanies) {
            const addRes = await request("/api/companie/manager/add", {
                managerId: data.data.id,
                companieId: item.id
            })

            if(addRes.success === false) {
                await alertPopup(addRes.message)
                return
            }
        }

        for(const item of removedCompanies) {
            await request("/api/admin/manager/removeCompanie", {
                managerId: data.data.id,
                companieId: item.id
            })
        }

        location.reload()
    })


    async function changeCompanies(allCompanies, currentCompanies) {
        let userCompanies = [...currentCompanies]

        let alertResolve = null

        const alertResponse = new Promise((resolve) => {
            alertResolve = resolve
        })

        const { remove } = overlay(() => {
            alertResolve(null)
            wrapper.remove()
            remove()
        }, true)

        const wrapper = document.createElement("div")
        wrapper.classList.add("changeCompanie")

        const title = document.createElement("h4")
        title.innerText = "Endre kompanier"

        const companies = document.createElement("div")
        
        const selectWrapper = document.createElement("div")
        selectWrapper.classList.add("peletongSelect")

        const display = document.createElement("div")
        const displayTitle = document.createElement("p")
        displayTitle.innerText = "Velg kompanie"

        const displayImg = document.createElement("img")
        displayImg.src = "../icons/expand.svg"

        display.append(displayTitle, displayImg)
        const options = document.createElement("div")
        options.classList.add("hidden")


        selectWrapper.append(display, options)
    
        display.addEventListener("click", () => {
            options.classList.toggle("hidden")
            display.classList.toggle("companieSelectOpen")
        })

        for(let i = 0; i < allCompanies.length; i++) {
            const option = document.createElement("p")
            option.innerText = allCompanies[i].name

            option.addEventListener("click", () => {
                const found = userCompanies.find(company => company.id === allCompanies[i].id)
                if(found) return

                userCompanies.push(allCompanies[i])
                addCompany(allCompanies[i])
            })

            options.appendChild(option)
        }

        function addCompany(company) {

            const wrapper = document.createElement("div")

            const title = document.createElement("p")
            title.innerText = company.name

            const remove = document.createElement("p")
            remove.innerText = "X"

            wrapper.addEventListener("click", () => {
                const index = userCompanies.findIndex(companies => companies.id === company.id)
                userCompanies.splice(index, 1)
                wrapper.remove()
            })

            wrapper.append(title, remove)
            companies.appendChild(wrapper)
        }

        for(let i = 0; i < currentCompanies.length; i++) {
            addCompany(currentCompanies[i])
        }

        const buttonWrapper = document.createElement("div")
        buttonWrapper.dataset.row = ""
        buttonWrapper.dataset.gap = ""


        const cancelButton = document.createElement("button")
        cancelButton.innerText = "Avbryt"
        cancelButton.classList.add("button")
        cancelButton.dataset.denied = ""

        cancelButton.addEventListener("click", () => {
            alertResolve(null)
            wrapper.remove()
            remove()
        })

        const saveButton = document.createElement("button")
        saveButton.innerText = "Lagre"
        saveButton.classList.add("button")
        saveButton.dataset.accept = ""

        saveButton.addEventListener("click", async () => {
            alertResolve(userCompanies)
            wrapper.remove()
        })
        
        buttonWrapper.append(cancelButton, saveButton)
        
        wrapper.append(title, companies, selectWrapper, buttonWrapper)

        document.body.appendChild(wrapper)

        return alertResponse
    }

}

function addParrent(member, listId) {
    const wrapper = document.createElement("div")
    wrapper.classList.add("user")

    const memberButtonsId = `Buttons${Math.floor(Math.random() * 100000)}`

    wrapper.innerHTML += `
        <p>${member?.personal?.firstName} ${member?.personal?.lastName}</p>
        <div class="buttons" id="${memberButtonsId}">
            <button class="normal">Rediger</button>
            <button class="red">Slett</button>
        </div>
    `
    document.getElementById(listId).appendChild(wrapper)

    const buttons = document.getElementById(memberButtonsId).children

    buttons[0].addEventListener("click", async () => {
        const update = await editPersonal(member)
        if(update.success === false) return

        wrapper.children[0].innerText = `${update.personal.firstName} ${update.personal.lastName}`
    })

    buttons[1].addEventListener("click", async () => {
        const deletePopup = await alertPopup("Er du sikker på at du vil slette denne brukeren?")
    
        if(deletePopup === "close") return
        if(deletePopup === "accept") {
            const data = await request("/api/user/delete", {
                userId: member.id
            })
        
            if (data.success === false) {
                await alertPopup(data.message)
                return
            }

            wrapper.remove()
        }
    })

}

document.getElementById("newLeder").addEventListener("click", async () => {
    const data = await newUser("MANAGER")
    if(data.success == false) return
    console.log(data)
    addManager({ ...data.data, password: data.password }, "roleManagerList")
    await alertPopup("Bruker vil legge til personlig informasjon ved første innlogging. " + " Ikke glem passordet" + "\n Passord:" + data.password)
})

document.getElementById("newParrent").addEventListener("click", async () => {
    const data = await newUser("PARRENT")
    if(data.success == false) return

    addParrent({ ...data.data, password: data.password }, "roleParrentList")
    await alertPopup("Bruker vil legge til personlig informasjon ved første innlogging. " + " Ikke glem passordet" + "\n Passord:" + data.password)

})

document.getElementById("newMember").addEventListener("click", async () => {
    const data = await newUser("MEMBER")
    console.log(data)
    if(data.success == false) return

    addMember({ ...data.data, password: data.password }, "roleMemberList")
    await alertPopup("Bruker vil legge til personlig informasjon ved første innlogging. " + " Ikke glem passordet" + "\n Passord:" + data.password)

})