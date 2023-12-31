const title = document.getElementById("title")
const folder = document.getElementById("folder")

const folderOptions = {
    members: document.getElementById("memberOption"),
    managers: document.getElementById("managerOption"),
    parrents: document.getElementById("parrentOption")
}

const folderSlides = {
    members: document.getElementById("memberSlide"),
    managers: document.getElementById("managerSlide"),
    parrents: document.getElementById("parrentSlide")
}

function clearActive() {
    for (const option in folderOptions) {
        folderOptions[option].dataset.active = ""
    }
}

function updateActive(key) {
    clearActive()
    folderOptions[key].dataset.active = "true"
}

function listOptionEventListeners(key) {
    folderOptions[key].addEventListener("click", () => {
        folderSlides[key].scrollIntoView()
        updateActive(key)
    })
}

for (const option in folderOptions) {
    listOptionEventListeners(option)
}

function renderUser(user, listId, linkTo = null, linkToListName = null) {
    const personalData = user.personal

    const wrapper = document.createElement("div")
    wrapper.classList.add("rowInfo")
    wrapper.dataset.row = ""
    wrapper.dataset.alignCenter = ""
    wrapper.id = "wrapper" + personalData?.phone

    const pictureWrapper = document.createElement("div")
    pictureWrapper.classList.add("rowItem")
    pictureWrapper.classList.add("rowPic")
    pictureWrapper.dataset.small = ""

    const picture = document.createElement("img")
    picture.setAttribute("loading", "lazy")
    picture.src = "/api/user/image/" + personalData.id
    picture.addEventListener("error", () => {
        picture.src = "/icons/user.svg"
    })
    pictureWrapper.appendChild(picture)

    const name = document.createElement("p")
    name.classList.add("rowItem")
    name.dataset.big = ""
    name.innerText = `${personalData?.firstName} ${personalData?.lastName}`

    const phone = document.createElement("p")
    phone.classList.add("rowItem")
    phone.dataset.medium = ""
    phone.innerText = personalData?.phone
    phone.href = `tel:${personalData?.phone}`

    const email = document.createElement("p")
    email.classList.add("rowItem")
    email.dataset.big = ""
    email.innerText = personalData?.email
    email.href = `mailto:${personalData?.email}`
    

    const parrentWrapper = document.createElement("div")
    parrentWrapper.classList.add("rowItem")
    parrentWrapper.classList.add("parrents")
    parrentWrapper.dataset.big = ""
    parrentWrapper.dataset.column = ""
    parrentWrapper.id = personalData?.phone + "LinkTo"
    
    if (linkTo) {
        linkTo.forEach(parrent => {
            const parrentLink = addLinkTo(
                parrent.user.personal?.firstName, 
                parrent.user.personal?.lastName, 
                parrent.user.personal?.phone, 
                linkToListName
            )
            parrentWrapper.appendChild(parrentLink)
        })
    }

    wrapper.appendChild(pictureWrapper)
    wrapper.appendChild(name)
    wrapper.appendChild(phone)
    wrapper.appendChild(email)
    wrapper.appendChild(parrentWrapper)

    wrapper.addEventListener("click", (e) => {
        if(e.target.dataset.parrent == "yes") return
        editPersonal(user, false)
    })

    const hr = document.createElement("hr")
    hr.dataset.short = ""

    document.getElementById(listId).appendChild(wrapper)
    document.getElementById(listId).appendChild(hr)
}

function addLinkTo(firstName, lastName, phone, listName, wrapperId = null) {
    const parrentLink = document.createElement("p")
    parrentLink.innerText = `${firstName} ${lastName}`

    parrentLink.addEventListener("click", () => {
        const link = document.getElementById("wrapper" + phone)
        link.scrollIntoView({ behavior: "smooth", block: "start"})
        updateActive(listName)

        let scrollInterval = null

        function highlight() {
            clearInterval(scrollInterval)
            link.classList.add("highlight")
            setTimeout(() => {
                link.classList.remove("highlight")
            }, 500) 
        }

        setTimeout(() => {
            scrollInterval = setInterval(() => {
                const scrollWidth = (folder.scrollWidth - folder.clientWidth) / 2
                if (folder.scrollLeft < 60) {
                    highlight()
                    return
                } else if (folder.scrollLeft > scrollWidth) {
                    highlight() 
                    return
                }
            })
        }, 300)
        
    })

    parrentLink.dataset.parrent = "yes"
    if(wrapperId) {
        document.getElementById(wrapperId).appendChild(parrentLink)
    }
    return parrentLink
}

function convertBytesToDataURL(bytes) {
    const uint8Array = new Uint8Array(bytes);
    const blob = new Blob([uint8Array]);
    const dataUrl = URL.createObjectURL(blob);
    return dataUrl;
}

function getUrlParam(param) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(param)
}

async function fetchPlatoonData() {
    const platoonId = getUrlParam("id")
    if (!platoonId) {
        await alertPopup("Id er ble ikke fundet")
        return history.go(-1)
    } else if (isNaN(platoonId)) {
        await alertPopup("Id er ikke et nummer")
        return history.go(-1)
    }

    const platoon = await request("/api/platoon/id", { platoonId: Number(platoonId) })
    console.log(platoon)
    if (platoon.success == false) {
        await alertPopup(platoon.message)
        window.location.href = platoon.redirect
        return
    }

    const name = `Peletong ${platoon.data.name}`
    const members = platoon.data.membersWithParrents
    const managers = platoon.data.managers
    

    members.forEach(member => {
        renderUser(member.user, "memberList", member.parrents, "parrents")
        console.log(member)
        member.parrents.forEach(parrent => {


            const parrentWrapper = document.getElementById("wrapper" + parrent.user.personal.phone)
            if (parrentWrapper) {
                addLinkTo(
                    member.user.personal?.firstName, 
                    member.user.personal?.lastName, 
                    member.user.personal?.phone, 
                    "members",
                    parrent.user.personal?.phone + "LinkTo" 
                )
                return
            }

            renderUser(parrent.user, "parrentList", [member], "members")
        })
    })

    managers.forEach(manager => {
        renderUser(manager.user, "managerList")
    })

    title.innerText = name
}

fetchPlatoonData()