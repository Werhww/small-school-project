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

    router.push("/")
}

</script>

<template>
<div class="wrapper" data-row data-align-center data-justify-center>
    <div data-column data-big-gap>
        <h1 data-bold>Login</h1>
        <div>
            <h5 data-error-text v-if="errorText">{{ errorText }}</h5>
            <div class="input" data-w-icon data-shadow-hover data-width>
                <label for="password">
                    <img src="/images/key.svg" alt="">
                </label>
                <input type="text" id="password" placeholder="passord" v-model="password" :disabled="disabled">
            </div>
            <p data-helper-text>Ingen konto? Kontakt <NuxtLink to="/">her</NuxtLink></p>
        </div>

        
        <button class="button" data-shadow-hover @click="login" data-width>Login</button>
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

    *[data-width] {
        max-width: 26.25rem;
        min-width: 20rem;
        width: 100%;
    }

    > img {
        width: 100%;
        min-width: 30rem;
        max-width: 53.125rem;
    }
}

@media screen and (max-width: 980px) {
    .wrapper {
        > img {
            display: none;
        }
    }
    
}
</style>