const form = document.getElementById('createUserForm');


async function request(path, body) {
    return fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    })
}

async function createUser() {
    const newUser = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({
            name: name.value,
            email: email.value
        }),
    })

    const response = await newUser.json()

    console.log(response)

    const formData = new FormData(request);
}

submit.addEventListener('click', createUser);