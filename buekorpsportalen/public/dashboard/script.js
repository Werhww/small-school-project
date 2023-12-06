const companieContainer = document.getElementById("companieContainer")

function renderCompanie(companie) {
    const wrapper = document.createElement("div")
    wrapper.classList.add("companie")

    wrapper.innerHTML = `
        <div class="folders" id="folders${companie.id, companie.name}" >
            <div class="folder">
                <div data-top></div>
                <div data-bottom></div>
            </div>
            <div class="folder" id="editBottom${companie.id, companie.name}">
                <div data-top></div>
                <div data-bottom>
                    <img src="../icons/edit.svg">
                </div>
            </div>
            <div class="folder" id="deleteBottom${companie.id, companie.name}">
                <div data-top></div>
                <div data-bottom>
                    <img src="../icons/delete.svg">
                </div>
            </div>
        </div>
    `
    const title = document.createElement("input")
    title.type = "text"
    title.value = companie.name
    
    title.addEventListener("focusout", () => editName(title.value, companie.id))
    title.addEventListener("click", () => {
        title.blur()
        window.location.href = `/dashboard/companie?id=${companie.id}`
    })

    

    const mobileCover = document.createElement("div")
    mobileCover.classList.add("mobileCover")
    mobileCover.addEventListener("click", () => {
        mobileCover.style.display = "none"
        wrapper.classList.add("folderHover")
    })

    wrapper.append(title, mobileCover)

    companieContainer.appendChild(wrapper)

    document.getElementById(`folders${companie.id, companie.name}`)
        .addEventListener("mouseover", (e) => {
            wrapper.classList.add("folderHover")
        })

    document.getElementById(`folders${companie.id, companie.name}`)
        .addEventListener("mouseout", () => {
            wrapper.classList.remove("folderHover")
            mobileCover.style.display = "flex"
        })

    document.getElementById(`editBottom${companie.id, companie.name}`)
        .addEventListener("click", () => title.focus())

    document.getElementById(`deleteBottom${companie.id, companie.name}`)
        .addEventListener("click", () => deleteCompanie(companie.id))
}

async function editName(newName, id) {
    const data = await request("/api/companie/edit", {
        name: newName,
        companieId: id
    })

    if (data.success === false) {
        await alertPopup(data.message)
        return
    }

}

async function deleteCompanie(id) {
    const deletePopup = await alertPopup("Er du sikker på at du vil slette dette kompaniet?")
    
    if(deletePopup === "close") return
    if(deletePopup === "accept") {
        const data = await request("/api/companie/delete", {
            companieId: id
        })
    
        if (data.success === false) {
            await alertPopup(data.message)
            return
        }
    }
}

function newCompaniePlaceholder() {
    const wrapper = document.createElement("div")
    wrapper.classList.add("companie")

    wrapper.innerHTML = `
        <div class="folders">
            <div class="newFolder">
                <div data-top></div>
                <div data-bottom>
                    <img src="../icons/add.svg">
                </div>
            </div>
            <div class="newFolder">
                <div data-top></div>
                <div data-bottom>
                    <img src="../icons/add.svg">
                </div>
            </div>
            <div class="newFolder">
                <div data-top></div>
                <div data-bottom>
                    <img src="../icons/add.svg">
                </div>
            </div>
        </div>
        <h4>Ny kompani</h4>
    `

    wrapper.addEventListener("click", () => {
        newCompanie()
    })

    wrapper.addEventListener("mouseover", () => {
        wrapper.classList.add("folderHover")
    })

    wrapper.addEventListener("mouseout", () => {
        wrapper.classList.remove("folderHover")
    })


    companieContainer.appendChild(wrapper)
}

async function fetchManagersCompanies() {
    const res = await fetch("/api/companie/token")
    const data = await res.json()

    if (data.success === false) {
        await alertPopup(data.message)
        window.location.href = data.redirect
        return
    }

    for(let i = 0; i < data.data.length; i++) {
        renderCompanie(data.data[i])
    }

    newCompaniePlaceholder()
}


fetchManagersCompanies()