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
    })

    accept.addEventListener("click", () => {
        alert.remove()
        alertResolve("accept")
    })

    document.body.appendChild(alert)
    return alertResponse
}

async function newFolder(companieId) {
    const wrapper = document.createElement("div")
    wrapper.classList.add("newFolder")

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
        outOfBound.remove()
    })

    const create = document.createElement("button")
    create.innerText = "Opprett"
    create.classList.add("button")
    create.dataset.accept = ""
    create.addEventListener("click", async () => {
        const name = input.value
        if (name.length < 1) return

        const res = await request("/api/platoon/create", {
            name,
            companieId: Number(companieId)
        })

        if (res.success === false) {
            await alertPopup(res.message)
            return
        }

        wrapper.remove()
        outOfBound.remove()
        location.reload()
    })

    buttons.appendChild(cancel)
    buttons.appendChild(create)

    wrapper.appendChild(title)
    wrapper.appendChild(input)
    wrapper.appendChild(buttons)

    const outOfBound = document.createElement("div")
    outOfBound.classList.add("outOfBound")

    outOfBound.addEventListener("click", () => {
        wrapper.remove()
        outOfBound.remove()
    })

    document.body.appendChild(outOfBound)
    document.body.appendChild(wrapper)
}