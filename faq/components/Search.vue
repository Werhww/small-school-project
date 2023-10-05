<template>
<div class="search">
    <img src="/search.svg" alt="Search">
    <input type="text" placeholder="search..." v-model="searchText">
</div>
</template>

<script setup lang="ts">
// Search emit to Header element
const emit = defineEmits<{
    (event: 'search', value:string): void
}>()

const searchText = ref()
let seachWatch: NodeJS.Timeout | null = null

watch(searchText, (value) => {
    if (seachWatch) clearTimeout(seachWatch)

    seachWatch = setTimeout(() => {

        emit('search', value)
        seachWatch = null
    }, 200)
})
</script>

<style scoped lang="scss">
.search {
    transition: 0.3s;

    display: flex;
    gap: .5rem;
    align-items: center;

    border: solid 1px #616161;
    border-radius: 0.3rem;
    padding: 0.5rem 0.625rem;

    &:has(input:not(:placeholder-shown)) {
        border: solid 1p #000;
    }

    input {
        outline: none;
        border: none;
        
        font-size: 1rem;
        color: #000;

        width: 10rem;


        ::placeholder {
            font-size: 1.25rem;
            color: #616161;
        }

    }

    img {
        cursor: pointer;
    }
}
</style>