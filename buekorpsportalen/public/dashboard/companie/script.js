const title = document.getElementById('title')
const folders = document.getElementById('folders')

async function fetchCompanie() {
    const companieId = getUrlParam('id')
    if (!companieId) {
        return history.go(-1)
    } else if (isNaN(companieId)) {
        return history.go(-1)
    }

    const res = await fetch('/api/companie/id', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ companieId: Number(companieId) })
    })

    const data = await res.json()
    console.log(data)

    if(data.success === false) {
        window.location.href = data.redirect
        return
    }

    title.innerText = data.data.name
    data.data.platoons.forEach(platoon => {
        const folder = renderPlatoonFolder(platoon)
        folders.appendChild(folder)
    })
}

function getUrlParam(param) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(param)
}

function renderPlatoonFolder(platoon) {
    const wrapper = document.createElement('div')
    wrapper.classList.add('folder')

    const topWrapper = document.createElement('div')

    const top = document.createElement('div')
    top.dataset.top = ""

    const iconWrapper = document.createElement('div')
    iconWrapper.dataset.row = ""

    const editIcon = document.createElement('img')
    editIcon.src = '../../icons/edit.svg'
    iconWrapper.appendChild(editIcon)

    const deleteIcon = document.createElement('img')
    deleteIcon.src = '../../icons/delete.svg'
    deleteIcon.addEventListener('click', () => deletePlatoon(platoon.id))
    
    iconWrapper.appendChild(deleteIcon)


    topWrapper.appendChild(top)
    topWrapper.appendChild(iconWrapper)

    const bottom = document.createElement('div')
    bottom.dataset.bottom = ""

    const title = document.createElement('input')
    title.type = 'text'
    title.value = platoon.name

    function platoonOpen() {
        window.location.href = `/dashboard/companie/platoon?id=${platoon.id}`
    }

    bottom.addEventListener('click', platoonOpen)

    bottom.appendChild(title)

    editIcon.addEventListener('click', () => editPlatoon(platoon.id, title, bottom, platoonOpen))


    wrapper.appendChild(topWrapper)
    wrapper.appendChild(bottom)

    return wrapper
}

function editPlatoon(id, titleElement, bottomElement, openFunction) {
    const currentTitle = titleElement.value

    titleElement.focus()

    titleElement.addEventListener("focusout", () => {
        if (titleElement.value !== currentTitle) {
            fetch('/api/platoon/edit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ platoonId: id, name: titleElement.value })
            })
            console.log('edit')
        }

    })
}

function deletePlatoon(id) {
    console.log(id)
}

fetchCompanie()