const passwordInput = document.getElementById("password")
const submitButton = document.getElementById("button")
const errorMsg = document.getElementById("errorMsg")

submitButton.addEventListener("click", async () => {
    errorMsg.dataset.show = false
    passwordInput.disabled = true
    submitButton.disabled = true

    const password = passwordInput.value
    
    const data = await request("/api/auth", { password })

    if (data.success) {
        window.location.href = data.redirect
    } else {
        errorMsg.dataset.show = true
        errorMsg.innerText = data.message

        passwordInput.disabled = false
        submitButton.disabled = false
    }
})