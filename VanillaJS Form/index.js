const form = document.getElementById('info-knabber')
const dataViewer = document.getElementById('data')

form.addEventListener('submit',(e) => {
    e.preventDefault()
    const formData = new FormData(form)
    const data = Object.fromEntries(formData)

    for(const key in data) {
        console.log(key)
        if(data[key] == "") {
            alert('Alt må skrives inn')
            return
        }
    }

    localStorage.setItem('userData', JSON.stringify(data))
    showSavedData()
})

function showSavedData() {
    const data = localStorage.getItem('userData')
    console.log(data)
    dataViewer.innerText = data
}

function passwordCheck() {
    
}

showSavedData()