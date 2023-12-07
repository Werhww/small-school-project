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
        createCompani(data.data.companies[i], data.data.platoons, data.data.members, data.data.users, data.data.managers)
    }
}

getAllData()

function createCompani(comapnie, platoon, members, user, managers) {
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
            createPlatoon(platoon[i], comapniePlatoonsId, members, user)
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

function createPlatoon(platoon, comapniePlatoonsId, members, user) {
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

            addMember(userData, memberListId)
        }
    }
}

function addMember(member, listId) {
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

    buttons[0].addEventListener("click", () => {
        editPersonal(member)
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

function addManager(member, listId) {
    const wrapper = document.createElement("div")
    wrapper.classList.add("user")

    const buttonsId = `Buttons${Math.floor(Math.random() * 100000)}`
    const nameId = `Name${Math.floor(Math.random() * 100000)}`

    wrapper.innerHTML += `
        <p>${member?.personal?.firstName} ${member?.personal?.lastName}</p>
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

        document.getElementById(nameId).innerText = `${newData.data.firstName} ${newData.data.lastName}`
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