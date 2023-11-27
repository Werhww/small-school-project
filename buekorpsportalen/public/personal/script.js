const profilePicInput = document.getElementById('profilePic')
const profilePicPreview = document.getElementById('profilePicPreview')

profilePicInput.addEventListener('change', (event) => {
    const file = event.target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
        profilePicPreview.src = reader.result
        profilePicPreview.dataset.image = true
    }
})

const onlyNumberInputs = document.querySelectorAll('.onlyNumber')

function isNumber(e) {
    let char = e.key
    
    const normals = ["Backspace", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Tab", "Delete", "Home", "End", "Enter", "Escape", "Control", "Alt", "Shift", "Meta"]

    if (normals.includes(char)) return true
    if (/^[0-9+()-.]*$/.test(char)) return true
    
    e.preventDefault()
    return false
}

onlyNumberInputs.forEach(input => {
    input.addEventListener('keydown', isNumber)
})

const personalInfoForm = document.getElementById('personalInfoForm')

personalInfoForm.addEventListener('submit',async (e) => {
    e.preventDefault()

    const formData = new FormData(personalInfoForm)
    const data = Object.fromEntries(formData)

    const fields = personalInfoForm.getElementsByTagName('*')
    for(var i = 0; i < fields.length; i++) {
        fields[i].disabled = true
    }

    /* const response = await fetch('/api/user/addPersonal', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ...data,
            birthDate: new Date(data.birthDate).toISOString(),
            picture: null
        })
    })

    const result = await response.json()
    console.log(result) */

    const reader = new FileReader()

    reader.onload = async () => {
        const arrayBuffer = reader.result
        const blob = new Blob([arrayBuffer])

        const formData = new FormData()
        formData.append('picture', blob, 'image.jpg')

        const response = await fetch('/api/user/addImage', {
            method: 'POST',
            body: formData
        })

        const result = await response.json()
        console.log(result)
    }

    reader.readAsArrayBuffer(data.picture)
})