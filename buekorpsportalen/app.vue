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
<div class="bodyWrapper" data-column>
    <NuxtPage></NuxtPage>
</div>
</template>

<style scoped lang="scss">
.bodyWrapper {
    height: 100vh;

    padding: 0 3.75rem;
}
</style>


<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body, body * {
    padding: 0;
    margin: 0;
    font-family: 'Inter', sans-serif;
    color: var(--contrast);
}

body {
    background: var(--primary);
}

:root {
    --primary: #292929;
    --secondary: #CC0000;
    --contrast: #fff;
    --light: #B5B5B5;

    --border: 1px solid var(--contrast);
    --border-light: 1px solid var(--light);

    --box-height: 3.5rem;

    --border-radius: 0.5rem;

    --shadow-short: 0px 4px 4px rgba(0, 0, 0, 0.3);
    --shadow: 0px 8px 6px rgba(0, 0, 0, 0.3);
    --shadow-long: 0px 16px 8px rgba(0, 0, 0, 0.3);
}

* {
    &[data-medium] {
        font-weight: 500
    }

    &[data-semi-bold] {
        font-weight: 600;
    }

    &[data-bold] {
        font-weight: 700;
    }

    &[data-shadow-short] {
        filter: drop-shadow(var(--shadow-short));
    }

    &[data-shadow] {
       filter: drop-shadow(var(--shadow));
    }

    &[data-shadow-long] {
       filter: drop-shadow(var(--shadow-long));
    }

    &[data-shadow-hover] {
        transition: all 0.2s ease-in-out;
        filter: drop-shadow(var(--shadow-short));

        &:hover {
            filter: drop-shadow(var(--shadow));
        }
    }

    &[data-disabled="true"] {
        opacity: 0.6;
        cursor: not-allowed;
    }



    &[data-row] {
        display: flex;
    }

    &[data-column] {
        display: flex;
        flex-direction: column;
    }

    &[data-space-between] {
        justify-content: space-between;
    }

    &[data-align-center] {
        align-items: center;
    }

    &[data-justify-center] {
        justify-content: center;
    }

    &[data-flex] {
        flex: 1;
    }

    &[data-gap] {
        gap: 0.5rem;
    }

    &[data-big-gap] {
        gap: 3rem;
    }
}

h1 {
    font-size: 3rem;
    font-weight: 400;
}

h2 {
    font-size: 2.5rem;
    font-weight: 400;
}

h3 {
    font-size: 2rem;
    font-weight: 400;
}

h4 {
    font-size: 1.5rem;
    font-weight: 500;
}

h5 {
    font-size: 1.25rem;
    font-weight: 400;
}

p {
    font-size: 1rem;
    font-weight: 400;
}


.input[data-w-icon] {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.3rem;
    padding: 0 0.3rem;

    transition: all 0.2s ease-in-out;
    
    height: var(--box-height);
    border: var(--border-light);
    border-radius: var(--border-radius);

    background-color: var(--primary);

    label {
        transition: all 0.2s ease-in-out;
        opacity: 0.6;

        height: 2.5rem;
        width: 2.5rem;

        &:hover {
            cursor: pointer;
        }       
    }

    img {

        height: 2.5rem;
        width: 2.5rem;
        object-fit: contain;
    }

    input {
        transition: all 0.2s ease-in-out;

        font-size: 1.5rem;
        color: var(--light);

        background: transparent;
        border: none;
        outline: none;

        width: 100%;
        height: 100%;

        &:focus {
            color: var(--contrast);
        }

        &::placeholder {
            color: var(--light);
        }
    }

    &:has(input:focus) {
        border: var(--border);
    }

    &:has(input:not(:placeholder-shown)) {
        border: var(--border);
    }

    &:has(input:focus) > label {
        opacity: 1;
    }

    &:has(input:not(:placeholder-shown)) > label {
        opacity: 1;
    }
}

input[data-transparent] {
    font-size: 1.5rem;
    color: var(--accent);

    &::placeholder {
        color: var(--light);
    }
}

.button {
    transition: all 0.2s ease-in-out;

    border: none;
    outline: none;

    height: var(--box-height);
    border-radius: var(--border-radius);

    background-color: var(--secondary);
    color: var(--contrast);

    font-size: 1.5rem;
    font-weight: 600;

    width: 100%;

    &:hover {
        cursor: pointer;
        background-color: var(--secondary);
    }

    &:focus {
        opacity: 0.8;
    }
}
</style>