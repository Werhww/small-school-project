const folder = document.getElementById('folder')

const memberOption = document.getElementById('memberOption')
const memberSlide = document.getElementById('memberSlide')
memberOption.addEventListener('click', () => {
    folder.scrollLeft = memberSlide.offsetLeft - 66

})


const managerOption = document.getElementById('managerOption')
const managerSlide = document.getElementById('managerSlide')
managerOption.addEventListener('click', () => {
    folder.scrollLeft = managerSlide.offsetLeft - 64

})

const parrentOption = document.getElementById('parrentOption')
const parrentSlide = document.getElementById('parrentSlide')
parrentOption.addEventListener('click', () => {
    folder.scrollLeft = parrentSlide.offsetLeft - 64

})

const title = document.getElementById('title')
const userList = document.getElementById('userList')


async function fetchPlatoonData() {
    const response = await fetch('/api/platoon/token', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const platoon = await response.json()

    const members = platoon.data.membersWithParrents
    const managers = platoon.data.managers
    

    members.forEach(member => {
        renderUser(member.user)

    })
}

fetchPlatoonData()

function renderUser(user) {
    console.log("new user render ", user.id)
    const time = new Date()

    const personalData = user.personal

    const wrapper = document.createElement('div')
    wrapper.classList.add('rowInfo')
    wrapper.dataset.row = ""
    wrapper.dataset.alignCenter = ""

    const pictureWrapper = document.createElement('div')
    pictureWrapper.classList.add('rowItem')
    pictureWrapper.classList.add('rowPic')
    pictureWrapper.dataset.small = ""

    const picture = document.createElement('img')
    picture.src = '../icons/user.svg'
    if (personalData.picture) {
        const bytes = personalData.picture.data
        picture.src = convertBytesToDataURL(bytes)
    }
    pictureWrapper.appendChild(picture)

    const name = document.createElement('p')
    name.classList.add('rowItem')
    name.dataset.big = ""
    name.innerText = `${personalData.firstName} ${personalData.lastName}`

    const phone = document.createElement('a')
    phone.classList.add('rowItem')
    phone.dataset.medium = ""
    phone.innerText = personalData.phone
    phone.href = `tel:${personalData.phone}`

    const email = document.createElement('a')
    email.classList.add('rowItem')
    email.dataset.big = ""
    email.innerText = personalData.email
    email.href = `mailto:${personalData.email}`
    

    const parrentWrapper = document.createElement('div')
    parrentWrapper.classList.add('rowItem')
    parrentWrapper.classList.add('parrents')
    parrentWrapper.dataset.big = ""
    parrentWrapper.dataset.column = ""

    /* add parrent creation code */ 


    wrapper.appendChild(pictureWrapper)
    wrapper.appendChild(name)
    wrapper.appendChild(phone)
    wrapper.appendChild(email)
    wrapper.appendChild(parrentWrapper)

    userList.appendChild(wrapper)
    console.log("render finished, time " + (new Date() - time) + "ms")
}

function convertBytesToDataURL(bytes) {
    const uint8Array = new Uint8Array(bytes);
    const blob = new Blob([uint8Array]);
    const dataUrl = URL.createObjectURL(blob);
    return dataUrl;
}