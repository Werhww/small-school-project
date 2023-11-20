<script setup lang="ts">
const router = useRouter()
const cookie = useCookie('token')

router.beforeEach((to, from) => {
    if(cookie.value) {
        router.push('/auth')
    }
})

onMounted(() => {
    if(!cookie.value) {
        router.push('/auth')
    }
})

</script>

<template>
<NuxtPage></NuxtPage>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body, body * {
    padding: 0;
    margin: 0;
    font-family: 'Inter', sans-serif;
}

:root {
    --primary: #232323;
    --secondary: #ed4d4f;
    --accent: #fff;
}

h1 {
    font-size: 2.5rem;
    font-weight: 400;
}

h2 {
    font-size: 2rem;
    font-weight: 400;
}

h3 {
    font-size: 1.5rem;
    font-weight: 400;
}

h4 {
    font-size: 1.25rem;
    font-weight: 500;
}

p {
    font-size: 1rem;
    font-weight: 400;
}



* {
    &[data-bold] {
        font-weight: 700;
    }

    &[data-semi-bold] {
        font-weight: 600;
    }

    &[data-medium] {
        font-weight: 600;
    }
}
</style>