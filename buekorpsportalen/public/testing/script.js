const newUserForm = document.getElementById('newUser');

newUserForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const form  = new FormData(newUserForm)
    const data = Object.fromEntries(form.entries())

    const res = await fetch('/api/user/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })

    const json = await res.json()
    console.log(json)
    newUserForm.reset()
})

const newCompanieForm = document.getElementById('newCompanie');

newCompanieForm.addEventListener('submit', async (e) => {
    e.preventDefault() 

    const form  = new FormData(newCompanieForm)
    const data = Object.fromEntries(form.entries())
    console.log(data) 
    const res = await fetch('/api/companie/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })

    const json = await res.json()
    console.log(json)
    newCompanieForm.reset()
})

const newPlatoonForm = document.getElementById('newPlatoon');

newPlatoonForm.addEventListener('submit', async (e) => {
    e.preventDefault() 

    const form  = new FormData(newPlatoonForm)
    const data = Object.fromEntries(form.entries())
    console.log(data) 
    const res = await fetch('/api/platoon/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: data.name,
            companieId: Number(data.companieId)
        })
    })

    const json = await res.json()
    console.log(json)
    newCompanieForm.reset()
})

const addManagerToCompanieForm = document.getElementById('addManagerToCompanie');

addManagerToCompanieForm.addEventListener('submit', async (e) => {
    e.preventDefault() 

    const form  = new FormData(addManagerToCompanieForm)
    const data = Object.fromEntries(form.entries())
    console.log(data) 
    const res = await fetch('/api/companie/manager/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            managerId: Number(data.managerId),
            companieId: Number(data.companieId)
        })
    })

    const json = await res.json()
    console.log(json)
    newCompanieForm.reset()
})

const addUserToPlatoonForm = document.getElementById('addUserToPlatoon');

addUserToPlatoonForm.addEventListener('submit', async (e) => {
    e.preventDefault() 

    const form  = new FormData(addUserToPlatoonForm)
    const data = Object.fromEntries(form.entries())
    console.log(data) 
    const res = await fetch('/api/user/connectToPlatoon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId: Number(data.userId),
            platoonId: Number(data.platoonId)
        })
    })

    const json = await res.json()
    console.log(json)
    newCompanieForm.reset()
})