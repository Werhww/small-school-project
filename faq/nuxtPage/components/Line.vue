<template>
<hr/>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
    opacity: number
}>(), {
    opacity: 0.1
})
</script>

<style scoped>
hr {
    background-color: #000;
    opacity: v-bind(opacity);
    width: 100%;
    height: 2px;
}
</style>