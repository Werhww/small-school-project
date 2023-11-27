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

const personalInfoForm = document.getElementById('personalInfoForm')

personalInfoForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const formData = new FormData(personalInfoForm)
    const data = Object.fromEntries(formData)
    console.log(data)
})