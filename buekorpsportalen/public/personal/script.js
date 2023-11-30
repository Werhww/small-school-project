const profilePicInput = document.getElementById("profilePic")
const profilePicPreview = document.getElementById("profilePicPreview")

const maximumSize = 1000 * 1000 * 1 // 1MB

profilePicInput.addEventListener("change", async (event) => {
    const file = event.target.files[0]
    if(file.size >= maximumSize) {
        await alertPopup("Bilden er for stort, max 1mb")
        return
    }

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async () => {
        profilePicPreview.src = reader.result
        profilePicPreview.dataset.image = true
    }
})

profilePicPreview.addEventListener("error", () => {
    profilePicPreview.src = "/icons/user.svg"
    profilePicPreview.dataset.image = false
    console.log("error")
})

const onlyNumberInputs = document.querySelectorAll(".onlyNumber")

onlyNumberInputs.forEach(input => {
    input.addEventListener("keydown", isNumber)
})

const personalInfoForm = document.getElementById("personalInfoForm")

personalInfoForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const formData = new FormData(personalInfoForm)
    const data = Object.fromEntries(formData)

    const fields = personalInfoForm.getElementsByTagName("*")
    for(var i = 0; i < fields.length; i++) {
        fields[i].disabled = true
    }

    const result = await request("/api/user/personal/update", {
        ...data,
        birthDate: new Date(data.birthDate).toISOString(),
        picture: null
    })

    if(result.success == false) {
        await alertPopup(result.message)
        return
    }

    const reader = new FileReader()
    reader.onload = async () => {
        const arrayBuffer = reader.result
        const blob = new Blob([arrayBuffer])
        const formData = new FormData()
        formData.append("picture", blob, "image.jpg")
        
        const result = await fetch("/api/user/image/add", {
            method: "POST",
            body: formData
        })

        if (result.success == false) {
            await alertPopup(result.message)
            return
        }

        await alertPopup("Profilen din har blitt oppdatert")
        for(var i = 0; i < fields.length; i++) {
            fields[i].disabled = false
        }
    }

    reader.readAsArrayBuffer(data.picture)
})

async function loadPersonalInfo() {
    const res = await fetch("/api/user/personal/token")
    const result = await res.json()
    if (result.success == false) return
    
    for(const key in result.data) {
        if(key == "userId") continue
        if(key == "birthDate") {
            personalInfoForm[key].value = result.data[key].split("T")[0]
            continue
        }
        personalInfoForm[key].value = result.data[key]
    }

    profilePicPreview.src = `/api/user/image/${result.data.id}`
}


loadPersonalInfo()