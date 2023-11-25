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

    const res = await fetch('/api/companie/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })

    const json = await res.json()
    console.log(json)
    newCompanieForm.reset()
})