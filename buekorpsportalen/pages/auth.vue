<script setup lang="ts">
import { Role } from '@prisma/client';

const password = ref('')
const newRole = ref<Role>(Role.MEMBER)

async function createUser() {
    const newUser = await useFetch('/api/user/create', {
        method: 'POST',
        body: JSON.stringify({
            password: password.value,
            role: newRole.value
        })
    })

    userData.value = JSON.stringify(newUser.data.value)
}

const userData = ref('')

const seacrhId = ref('')
async function searchUser() {
    const user = useFetch("/api/user/find", {
        method: 'POST',
        body: JSON.stringify({
            id: Number(seacrhId.value)
        })
    })

    foundUser.value = JSON.stringify(user.data.value)
}

const foundUser = ref('')
</script>

<template>
<div>
    <p>test</p>
    <input type="text" v-model="password">
    <select v-model="newRole">
        <option v-for="value in Role" :value="value">{{ value }}</option>
    </select>
    <p @click="createUser">create user</p>
    <p>{{ userData }}</p>
</div>
<div>
    <p>test2</p>
    <input type="text" v-model="seacrhId">
    <p @click="searchUser">create user</p>
    <p>{{ foundUser }}</p>
</div>
</template>

<style scoped lang="scss">

</style>