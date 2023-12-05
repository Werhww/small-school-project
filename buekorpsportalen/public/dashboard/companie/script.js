const title = document.getElementById("title")
const folders = document.getElementById("folders")

async function fetchCompanie() {
    const companieId = getUrlParam("id")
    if (!companieId) {
        await alertPopup("Id er ble ikke fundet")
        return history.go(-1)
    } else if (isNaN(companieId)) {
        await alertPopup("Id er ikke et nummer")
        return history.go(-1)
    }
    const data = await request("/api/companie/id", { companieId: Number(companieId) })

    if(data.success === false) {
        await alertPopup(data.message)
        window.location.href = data.redirect
        return
    }

    title.innerText = data.data.name
    data.data.platoons.forEach(platoon => {
        const folder = renderPlatoonFolder(platoon)
        folders.appendChild(folder)
    })

    folders.appendChild(lastFolder(companieId))
}

function getUrlParam(param) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(param)
}

function renderPlatoonFolder(platoon) {
    const wrapper = document.createElement("div")
    wrapper.classList.add("folder")

    const topWrapper = document.createElement("div")

    const top = document.createElement("div")
    top.dataset.top = ""

    const iconWrapper = document.createElement("div")
    iconWrapper.dataset.row = ""

    const editIcon = document.createElement("img")
    editIcon.src = "../../icons/edit.svg"
    iconWrapper.appendChild(editIcon)

    const deleteIcon = document.createElement("img")
    deleteIcon.src = "../../icons/delete.svg"
    deleteIcon.addEventListener("click", async () => {
        const alertRes = await alertPopup("Er du sikker på at du vil slette peletongen?")
        if(alertRes === "accept") {
            const deleteRes = await deletePlatoon(platoon.id)
            if(deleteRes.success === false) {
                alertPopup(deleteRes.message)
            }
            wrapper.remove()
        }
    })
    
    iconWrapper.appendChild(deleteIcon)


    topWrapper.appendChild(top)
    topWrapper.appendChild(iconWrapper)

    const bottom = document.createElement("div")
    bottom.dataset.bottom = ""

    const title = document.createElement("input")
    title.type = "text"
    title.value = platoon.name

    function platoonOpen() {
        window.location.href = `/dashboard/companie/platoon?id=${platoon.id}`
    }

    bottom.addEventListener("click", platoonOpen)

    bottom.appendChild(title)

    editIcon.addEventListener("click", () => editPlatoon(platoon.id, title))


    wrapper.appendChild(topWrapper)
    wrapper.appendChild(bottom)

    return wrapper
}

function editPlatoon(id, titleElement) {
    const currentTitle = titleElement.value

    titleElement.focus()

    titleElement.addEventListener("focusout", async () => {
        if (titleElement.value !== currentTitle) {
            const res = await fetch("/api/platoon/edit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ platoonId: id, name: titleElement.value })
            })
            const data = await res.json()
            console.log(data)
            if(data.success === false) {
                window.location.href = data.redirect
                return
            }
        }
    })
}

async function deletePlatoon(id) {
    const res = await fetch("/api/platoon/delete", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ platoonId: id })
    })

    return  await res.json()
}

function lastFolder(companieId) {
    const wrapper = document.createElement("div")
    wrapper.classList.add("folder")
    wrapper.classList.add("addFolder")

    const top = document.createElement("div")
    top.dataset.top = ""

    const bottom = document.createElement("div")
    bottom.dataset.bottom = ""

    const img = document.createElement("img")
    img.src = "../../icons/add.svg"
    bottom.appendChild(img)

    wrapper.appendChild(top)
    wrapper.appendChild(bottom)

    wrapper.addEventListener("click", () => {
        newPlatoon(companieId)
    })

    return wrapper
}

fetchCompanie()