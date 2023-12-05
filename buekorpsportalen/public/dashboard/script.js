const companieContainer = document.getElementById("companieContainer")

function renderCompanie(companie) {
    const wrapper = document.createElement("div")
    wrapper.classList.add("companie")

    wrapper.innerHTML = `
        <div class="folders">
            <div class="folder">
                <div data-top></div>
                <div data-bottom></div>
            </div>
            <div class="folder">
                <div data-top></div>
                <div data-bottom id="editBottom${companie.id, companie.name}">
                    <img src="../icons/edit.svg">
                </div>
            </div>
            <div class="folder">
                <div data-top></div>
                <div data-bottom id="deleteBottom${companie.id, companie.name}">
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

    wrapper.appendChild(title)

    companieContainer.appendChild(wrapper)

    document.getElementById(`editBottom${companie.id, companie.name}`)
        .addEventListener("click", () => title.focus())

    document.getElementById(`deleteBottom${companie.id, companie.name}`)
        .addEventListener("click", () => deleteCompanie(companie.id))
}

function editName(newName, id) {
    console.log(newName,id)
}


async function deleteCompanie() {
    const deletePopup = await alertPopup("Er du sikker på at du vil slette dette kompaniet?")
    console.log(deletePopup)
    
    if(deletePopup === "close") return
    if(deletePopup === "accept") {
        console.log("delete")
    }
}

renderCompanie({
    name: "Hjørnebordet",
    id: 2
})