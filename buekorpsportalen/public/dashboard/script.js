const title = document.getElementById('title')
const list = document.getElementById('list')


async function fetchPlatoonMembers() {
    const response = await fetch('/api/users')
    const users = await response.json()
    return users
}

function renderUser(user) {
    const wrapper = document.createElement('div')

    const imageWrapper = document.createElement('div')
    imageWrapper.classList.add('rowItem')
    imageWrapper.dataset.small = ""

    const image = document.createElement('img')
    image.src = '../icons/user.svg'
    if (user.image) image.src = user.image

    const name = document.createElement('p')
    name.classList.add('rowItem')
    name.dataset.big = ""
    name.innerText = user.name

    const phone = document.createElement('a')
    phone.classList.add('rowItem')
    phone.dataset.medium = ""
    phone.innerText = user.phone
    phone.href = `tel:${user.phone}`

    const email = document.createElement('a')
    email.classList.add('rowItem')
    email.dataset.big = ""
    email.innerText = user.email
    email.href = `mailto:${user.email}`
    

    const parrentWrapper = document.createElement('div')
    parrentWrapper.classList.add('rowItem')
    parrentWrapper.classList.add('parrents')
    parrentWrapper.dataset.big = ""
    parrentWrapper.dataset.column = ""

    
}