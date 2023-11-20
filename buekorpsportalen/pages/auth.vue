<script setup lang="ts">
const router = useRouter()
const password = ref('')

function login() {
    const user = useFetch('/api/user/auth', {
        method: 'POST',
        body: JSON.stringify({
            password: password.value,
        })
    })
    
    if(user.data.value) {
        useCookie('token').value = user.data.value.token
        router.push('/')
    }
}

</script>

<template>
<div>
    <p>login</p>
    <input type="text" v-model="password">
    <button @click="login">user</button>
</div>
</template>

<style scoped lang="scss">

</style>