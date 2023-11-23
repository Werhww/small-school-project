<script setup lang="ts">
const router = useRouter()
const disabled = ref(false)
const password = ref('')

const errorText = ref("")

async function login() {
    const user = await useFetch('/api/user/auth', {
        method: 'POST',
        body: JSON.stringify({
            password: password.value,
        })
    })
    
    if(!user.data.value) return errorText.value = "Feil passord!"

    console.log(user.data.value)
    router.push("/")
}

</script>

<template>
<div class="wrapper" data-row data-align-center data-justify-center>
    <div data-column data-big-gap>
        <h1 data-bold>Login</h1>
        <div>
            <h5 data-error-text v-if="errorText">{{ errorText }}</h5>
            <div class="input" data-w-icon data-shadow-hover>
                <label for="password">
                    <img src="/images/key.svg" alt="">
                </label>
                <input type="text" id="password" placeholder="passord" v-model="password" :disabled="disabled">
            </div>
            <p data-helper-text>Ingen konto? Kontakt <RouterLink to="/">her</RouterLink></p>
        </div>

        
        <button class="button" data-shadow-hover @click="login">Login</button>
    </div>    

    <img src="/illustrations/login.svg" alt="">
</div>
</template>

<style scoped lang="scss">
.wrapper {
    width: 100%;

    padding-top: 5.375rem;
    align-self: center;

    *[data-helper-text] {
        text-align: end;
        color: var(--light);

        > a {
            color: var(--light);
        }
    }

    *[data-error-text] {
        color: var(--secondary);
        padding-bottom: 0.2rem;
    }
}
</style>