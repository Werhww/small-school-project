const companies = document.getElementById('companies')

async function getAllData() {
    const res = await fetch('/api/admin/dashboard')
    const data = await res.json()

    console.log(data)
}

getAllData()