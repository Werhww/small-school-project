<template>
<div class="faq">
    <div @click="open = !open" class="question">
        <p>{{ question }}</p>
        <img :class="{'rotate': open}" src="/arrow.svg" alt="">
    </div>
    <p :class="{'answer': true, 'answer-reveal': open}">{{ answer }}</p>
    <Line :opacity="0.3" />
</div>
</template>

<script setup lang="ts">
defineProps<{
    question: string
    answer: string
}>()

const open = ref(false)

</script>

<style scoped lang="scss">
.faq {
    .question {
        display:  flex;
        justify-content: space-between;

        padding: 1.25rem 1rem;

        > img {
            transform: rotate(-90deg);
            transition: transform 0.3s ease;
        }

        > p {
            font-size: 1.25rem;
            color: #000;
            font-weight: 500;
        }
    }

    .answer {
        padding: 0rem 1rem;
        margin-bottom: 0;
        height: 0;

        font-size: 1rem;

        color: #616161;

        transition: all .3s ease-out;
        overflow: hidden;
    }

    .answer-reveal {
        margin-bottom: 1.25rem!important;
        height: 2rem!important;
    }
}

.rotate {
    transform: rotate(0deg) !important;
}
</style>