<script setup lang="ts">
import { Role } from '@prisma/client';

const password = ref('')
const newRole = ref<Role>(Role.MEMBER)

async function createUser() {
    const newUser = await useFetch('/api/user/auth', {
        method: 'POST',
        body: JSON.stringify({
            password: password.value,
        })
    })

    userData.value = JSON.stringify(newUser.data.value)
}

const userData = ref('')

</script>

<template>
<div>
    <p>test</p>
    <input type="text" v-model="password">
    <select v-model="newRole">
        <option v-for="value in Role" :value="value">{{ value }}</option>
    </select>
    <button @click="createUser">create user</button>
    <p>{{ userData }}</p>
</div>
</template>

<style scoped lang="scss">

</style>