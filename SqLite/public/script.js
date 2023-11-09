const form = document.getElementById("createUserForm")
const form2 = document.getElementById("createPostForm")

async function request(path, method, body) {
    return fetch(path, {
        method: method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    })
}

async function createUser(e) {
    e.preventDefault()
    const formData = new FormData(form);
    const body = Object.fromEntries(formData);
    if (body.email === "") {
        alert("Missing email")
        return
    }

    const newUser = await request("/api/user", "POST", body)

    const response = await newUser.json()

    console.log(response)
}

async function createPost(e) {
    e.preventDefault()
    const formData = new FormData(form2);
    const body = Object.fromEntries(formData);

    if (body.authorId === "" || body.title === "") {
        alert("Missing authorId or title")
        return
    }

    console.log(body)


    const newPost = await request("/api/post", "POST", body)

    const response = await newPost.json()

    console.log(response)
}

form.addEventListener("submit", createUser)
form2.addEventListener("submit", createPost)