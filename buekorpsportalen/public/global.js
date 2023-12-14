async function request(url, data) {
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    return await res.json()
}

function isNumber(e) {
    let char = e.key
    
    const normals = ["Backspace", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Tab", "Delete", "Home", "End", "Enter", "Escape", "Control", "Alt", "Shift", "Meta"]

    if (normals.includes(char)) return true
    if (/^[0-9+()-.]*$/.test(char)) return true
    
    e.preventDefault()
    return false
}

function alertPopup(message) {
    const alert = document.createElement("div")
    alert.classList.add("alert")

    const title = document.createElement("h2")
    title.innerText = "Alert"
    
    const messageElm = document.createElement("h4")
    messageElm.innerText = message

    const buttons = document.createElement("div")

    const close = document.createElement("button")
    close.innerText = "Avbryt"
    close.classList.add("button")
    close.dataset.denied = ""

    const accept = document.createElement("button")
    accept.innerText = "OK"
    accept.classList.add("button")
    accept.dataset.accept = ""

    buttons.appendChild(close)
    buttons.appendChild(accept)

    alert.appendChild(title)
    alert.appendChild(messageElm)
    alert.appendChild(buttons)

    let alertResolve = null

    const alertResponse = new Promise((resolve, reject) => {
        alertResolve = resolve
    })

    close.addEventListener("click", () => {
        alert.remove()
        alertResolve("close")
        remove()
    })

    accept.addEventListener("click", () => {
        alert.remove()
        alertResolve("accept")
        remove()
    })

    const { remove } = overlay(() => {
        alert.remove()
        alertResolve("close")
    }, true)
    document.body.appendChild(alert)
    return alertResponse
}

async function newPlatoon(companieId, reload = true) {
    const wrapper = document.createElement("div")
    wrapper.classList.add("newPlatoon")

    const title = document.createElement("h3")
    title.innerText = "Ny peletong"

    const input = document.createElement("input")
    input.type = "text"
    input.name = "name"
    input.dataset.normal = ""
    input.dataset.unset = ""
    input.classList.add("input")
    input.placeholder = "Navn på peletong"

    const buttons = document.createElement("div")
    buttons.dataset.row = ""
    buttons.dataset.gap = ""

    const cancel = document.createElement("button")
    cancel.innerText = "Avbryt"
    cancel.classList.add("button")
    cancel.dataset.denied = ""
    cancel.addEventListener("click", () => {
        wrapper.remove()
        remove()
    })

    const create = document.createElement("button")
    create.innerText = "Opprett"
    create.classList.add("button")
    create.dataset.accept = ""

    let alertResolve = null

    const alertResponse = new Promise((resolve, reject) => {
        alertResolve = resolve
    })

    create.addEventListener("click", async () => {
        const name = input.value
        if (name.length < 1) return

        const data = await request("/api/platoon/create", {
            name,
            companieId: Number(companieId)
        })

        if (data.success === false) {
            await alertPopup(data.message)
            return  alertResolve(data)
        }

        wrapper.remove()
        remove()
        alertResolve(data)
        if(reload) location.reload()
    })

    buttons.appendChild(cancel)
    buttons.appendChild(create)

    wrapper.appendChild(title)
    wrapper.appendChild(input)
    wrapper.appendChild(buttons)

    const { remove } = overlay(() => {
        remove()
        wrapper.remove()
        alertResolve({ success: false })
    }, true)

    document.body.appendChild(wrapper)

    return alertResponse
}

async function newCompanie() {
    const wrapper = document.createElement("form")
    wrapper.classList.add("newCompanie")

    wrapper.innerHTML = `
        <h3>Ny kompani</h3>
        <input type="text" name="name" data-normal data-unset class="input" placeholder="Navn på kompani">
        <div data-row data-gap>
            <button type="submit" class="button" data-denied>Avbryt</button>
            <button type="submit" class="button" data-accept>Opprett</button>
        </div>
    `

    const { remove } = overlay(() => {
        wrapper.remove()
        alertResolve({ success: false })
    }, true)

    let alertResolve = null

    const alertResponse = new Promise((resolve, reject) => {
        alertResolve = resolve
    })

    wrapper.addEventListener("submit", async (e) => {
        e.preventDefault()
        const submitBtn = e.submitter
        if (submitBtn.hasAttribute("data-denied")) {
            wrapper.remove()
            remove()
            alertResolve()
            return
        }
        
        const name = wrapper["name"].value
        if (name.length < 1) return

        const data = await request("/api/companie/create", {
            name
        })
        
        if (data.success === false) {
            await alertPopup(data.message)
            return alertResolve(data)
        }

        alertResolve(data)
        wrapper.remove()
        remove()
    })

    document.body.appendChild(wrapper)

    return alertResponse
}

async function newUser(role) {
    const wrapper = document.createElement("form")
    wrapper.classList.add("newCompanie")

    wrapper.innerHTML = `
        <h3>Ny Bruker</h3>
        <input type="text" name="password" data-normal data-unset class="input" placeholder="Uniqe Passord">
        <div data-row data-gap>
            <button type="submit" class="button" data-denied>Avbryt</button>
            <button type="submit" class="button" data-accept>Opprett</button>
        </div>
    `

    const { remove } = overlay(() => {
        wrapper.remove()
        remove()
        alertResolve({ success: false })
    }, true)


    let alertResolve = null

    const alertResponse = new Promise((resolve, reject) => {
        alertResolve = resolve
    })


    wrapper.addEventListener("submit", async (e) => {
        e.preventDefault()

        const submitBtn = e.submitter

        if (submitBtn.hasAttribute("data-denied")) {
            wrapper.remove()
            remove()
            return alertResolve({ success: false })
        }
        
        const password = wrapper["password"].value
        if (password.length < 1) return

        wrapper.remove()
        remove()
 
        const data = await request("/api/user/create", {
            password: password,
            role: role
        })
        
        if (data.success === false) {
            await alertPopup(data.message)
            return alertResolve(data)
        }

        alertResolve({ ...data, password })
    })

    document.body.appendChild(wrapper)

    return alertResponse
}

async function editPersonal(member) {
    const wrapper = document.createElement("form")
    wrapper.classList.add("editPersonalInfo")

    let personal = member.personal

    if(personal) {
        const data = await request("/api/user/personal/id", {
            userId: member.id
        })

        if (data.success === true) {
            personal = data.data

            wrapper.innerHTML = `
                <h3>Oppdater personlig info</h3>
                <input value="${personal.firstName}" type="text" required name="firstName" data-normal data-unset class="input" placeholder="fornavn">
                <input value="${personal.lastName}" type="text" required name="lastName" data-normal data-unset class="input" placeholder="etternavn">
                <input value="${personal.email}" type="text" required name="email" data-normal data-unset class="input" placeholder="epost">
                <input value="${personal.phone}" type="text" required name="phone" data-normal data-unset class="input" placeholder="telefon" maxlength="8">
                <input value="${personal.birthDate.split("T")[0]}" type="date" required name="birthDate" data-normal data-unset class="input onlyNumber" placeholder="bursdag">
                <input value="${personal.address}" type="text" required name="address" data-normal data-unset class="input" placeholder="addresse">
                <input value="${personal.city}" type="text" required name="city" data-normal data-unset class="input" placeholder="by">
                <input value="${personal.postalCode}" type="text" required name="postalCode" data-normal data-unset class="input onlyNumber" placeholder="postnummer">

                <div data-row data-gap id="editPersonalButtons" >
                    <button type="button" class="button" data-denied>Avbryt</button>
                    <button type="submit" class="button" data-accept>Endre</button>
                </div>
            `
        } 
    } else {
        wrapper.innerHTML = `
        <h3>Oppdater personlig info</h3>
            <input type="text" required name="firstName" data-normal data-unset class="input" placeholder="fornavn">
            <input type="text" required name="lastName" data-normal data-unset class="input" placeholder="etternavn">
            <input type="text" required name="email" data-normal data-unset class="input" placeholder="epost">
            <input type="text" required name="phone" data-normal data-unset class="input" placeholder="telefon" maxlength="8">
            <input type="date" required name="birthDate" data-normal data-unset class="input onlyNumber" placeholder="bursdag">
            <input type="text" required name="address" data-normal data-unset class="input" placeholder="addresse">
            <input type="text" required name="city" data-normal data-unset class="input" placeholder="by">
            <input type="text" required name="postalCode" data-normal data-unset class="input onlyNumber" placeholder="postnummer">

            <div data-row data-gap id="editPersonalButtons" >
                <button type="button" class="button" data-denied>Avbryt</button>
                <button type="submit" class="button" data-accept>Endre</button>
            </div>
        ` 
    }

    const { remove } = overlay(() => {
        wrapper.remove()
        alertResolve({ success: false })
    }, true)

    let alertResolve = null

    const alertResponse = new Promise((resolve, reject) => {
        alertResolve = resolve
    })

    wrapper.addEventListener("submit", async (e) => {
        e.preventDefault()

        const formData = new FormData(wrapper)
        const formDataEntries = Object.fromEntries(formData.entries())

        wrapper.remove()
        remove()
 
        const data = await request("/api/user/personal/updateWithId", {
            userId: member.id,
            personalBody: {
                ...formDataEntries,
                birthDate: new Date(formDataEntries.birthDate).toISOString()
            }
        })
        
        if (data.success === false) {
            await alertPopup(data.message)
            return alertResolve(data)
        }

        alertResolve({ ...data, personal: formDataEntries})
    })

    document.body.append(wrapper)

    const onlyNumberInputs = document.querySelectorAll(".onlyNumber")

    onlyNumberInputs.forEach(input => {
        input.addEventListener("keydown", isNumber)
    })

    document.getElementById("editPersonalButtons").children[0].addEventListener("click", () => {
        wrapper.remove()
        remove()
        alertResolve({ success: false })
    })


    return alertResponse
}

async function logOut() {
    await fetch('/api/logout')
    window.location.href = '/auth'
}

function overlay(onClick, blur = false) {
    const overlayDiv = document.createElement("div")
    overlayDiv.id = "overlay"

    overlayDiv.addEventListener("click", () => {
        onClick()
        overlayDiv.remove()
    })
    if(blur) {
        overlayDiv.style.backgroundColor = "rgba(0, 0, 0, 0.25)"
        overlayDiv.style.backdropFilter = "blur(6px)"
    }

    document.body.appendChild(overlayDiv)

    return { overlayDiv, remove: () => overlayDiv.remove() }
}