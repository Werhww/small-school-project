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
let loadedPersonalInfo = null
personalInfoForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const formData = new FormData(personalInfoForm)
    const data = Object.fromEntries(formData)

    const fields = personalInfoForm.getElementsByTagName("*")
    for(var i = 0; i < fields.length; i++) {
        fields[i].disabled = true
    }

    let changedElements = {}
    for (const key in data) {
        if(!loadedPersonalInfo) {
            if(key === "birthDate") {
                changedElements[key] = new Date(data[key]).toISOString()
                continue
            }

            changedElements[key] = data[key]
            continue
        }

        if(key === "birthDate") {
            if (data[key] !== loadedPersonalInfo[key].split("T")[0]) {
                changedElements[key] = new Date(data[key]).toISOString()
            }
            continue
        }

        if (data[key] !== loadedPersonalInfo[key]) {
            changedElements[key] = data[key]
        }
    }

    const result = await request("/api/user/personal/update", {
        ...changedElements,
        picture: null   
    })

    if(result.success == false) {
        await alertPopup(result.message)
        return
    }

    const reader = new FileReader()
    reader.onload = async () => {
        const arrayBuffer = reader.result
        console.log(arrayBuffer, profilePicInput.files[0])
        const blob = new Blob([arrayBuffer])
        const formData = new FormData()
        formData.append("picture", blob, "image.jpg")
        formData
        
        const data = await request("/api/user/image/add", formData)

        if (data.success == false) {
            await alertPopup(data.message)
            return
        }

        await alertPopup(result.message)
        window.location.href = result.redirect
    }

    if( profilePicInput.files.length == 0 ) {
        await alertPopup(result.message)
        window.location.href = result.redirect
        return
    } else {
        /* reader.readAsArrayBuffer(profilePicInput.files[0]) */
        const file = profilePicInput.files[0]
        const pictureForm = new FormData()
        pictureForm.append("file", file, "image.jpg")
        const res = await fetch("/api/user/image/add", {
            method: "POST",
            body: pictureForm,
/*             headers: { 
                "Content-Type": "multipart/form-data"
            } */
        })

        const data = await res.json()
        console.log(data)
        if (data.success == false) {
            await alertPopup(data.message)
            return
        }

        await alertPopup(result.message)
        window.location.href = result.redirect
    }
    
})

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

async function loadPersonalInfo() {
    const res = await fetch("/api/user/personal/token")
    const result = await res.json()
    if (result.success == false) return
    loadedPersonalInfo = result.data
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