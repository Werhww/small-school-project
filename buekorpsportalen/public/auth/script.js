const passwordInput = document.getElementById('password')
const submitButton = document.getElementById('button')
const errorMsg = document.getElementById('errorMsg')

submitButton.addEventListener('click', async () => {
    errorMsg.dataset.show = false
    passwordInput.disabled = true
    submitButton.disabled = true

    const password = passwordInput.value
    const res = await fetch('/api/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
    })

    const data = await res.json()

    if (data.success) {
        window.location.href = '/dashboard'
    } else {
        errorMsg.dataset.show = true
        errorMsg.innerText = data.message

        passwordInput.disabled = false
        submitButton.disabled = false
    }
})