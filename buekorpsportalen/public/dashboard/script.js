const title = document.getElementById('title')
const list = document.getElementById('list')

const res = await fetch('/api/notes')

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

    const phone = document.createElement('p')
    phone.classList.add('rowItem')
    phone.dataset.small = ""
    phone.innerText = user.phone

    const email = document.createElement('p')
    email.classList.add('rowItem')
    email.dataset.small = ""
    email.innerText = user.email

    const parrentWrapper = document.createElement('div')
    parrentWrapper.dataset.column = ""

    
}