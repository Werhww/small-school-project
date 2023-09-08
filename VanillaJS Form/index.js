const form = document.getElementById('info-knabber')
const dataViewer = document.getElementById('data')
const passwordInput = document.getElementById('password')
const allInputs = document.querySelectorAll('[data-input]')
const errorMsg = document.getElementById('error')
const title = document.getElementById('title')

form.addEventListener('submit', formSubmit)
let isError = false

function formSubmit(e) {
    e.preventDefault()
    if(isError) {
        alert('Oppfyll problemet')
        return
    }

    const formData = new FormData(form)
    const data = Object.fromEntries(formData)

    for(const key in data) {
        if(data[key] == "") {
            alert('Alt må skrives inn')
            return
        }
    }

    localStorage.setItem('userData', JSON.stringify(data))
    showSavedData()
    alert('Dataen er lagret!')
}

let passwordWatch = null

passwordInput.addEventListener('input', (el) => {
    if(passwordWatch) clearTimeout(passwordWatch)

    passwordWatch = setTimeout(() => {
        const passwordRes = isPasswordValid(el.target.value)
        console.log(passwordRes)

        if(!passwordRes.valid) {
            errorMsg.innerText = passwordRes.error
            isError = true
        } else {
            isError = false
            errorMsg.innerText = ""
        }

        passwordWatch = null
    }, 1000)
})

title.addEventListener('click', ()=> {
    localStorage.clear()
    showSavedData()
    console.log('clear')
})

function showSavedData() {
    const data = localStorage.getItem('userData')
    if(!data) {
        for(let i = 0; i < allInputs.length; i++) {
            allInputs[i].value = ""
        }
        return
    }
    const parsedData = JSON.parse(data)

    let i = 0
    for(const key in parsedData) {
        allInputs[i].value = parsedData[key]
        i++
    }
}

function isPasswordValid(password) {
    let error = '' 
    let hasMinLength = false
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    let hasBothCases = false
    
    const hasNumber = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password)
    
    hasSpecialChar? error = error: error = "Passord må inneholde spesial tegn"
    hasNumber? error = error: error = "Passord må inneholde minst et tall"
    hasUpperCase && hasLowerCase? hasBothCases = true: error = 'Passord må inneholde små og store bokstaver' 
    password.length > 10? hasMinLength = true: error = "Passord må minst være 10 karakterer lang"
  
    const conditionsPassed = [hasMinLength, hasBothCases, hasNumber, hasSpecialChar].filter((condition) => condition).length;
  
    return {
        valid : conditionsPassed >= 3,
        error: error
    }
}
  
showSavedData()