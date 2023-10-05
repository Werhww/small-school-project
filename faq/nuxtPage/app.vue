<template>
    <div class="header">
        <h1 @click="search('')">Faq</h1>
        <Search @search="search" />
    </div>
    <Line :opacity="0.3"/>

    <div class="questions">
        <Faq 
            v-for="question in shownList"
            :question="question.question"
            :answer="question.answer"
        />
    </div>
</template>

<script setup lang="ts">
type Question = {
  question: string,
  answer: string
}

const fullList: Question[] = [
    {
        question: "Hvordan kan jeg effektivt lære JS, HTML og CSS?",
        answer: " Du kan effektivt lære JS, HTML og CSS ved å søke på YouTube, bruke Stack Overflow og få tilgang til GitHub Copilot."
    },
    {
        question: "Skal vi lære å bruke React?",
        answer: "Nei, React er ikke en del av pensum."
    },
    {
        question: "Kommer vi til å gjøre noe relatert til IT-drift i VG1?",
        answer: "Nei, IT-drift blir hovedsakelig dekket i VG2."
    },
    {
        question: "Lærer vi spillprogrammering?",
        answer: "Nei, spillprogrammering er ikke en del av pensum."
    },
    {
        question: "Burde jeg velge IT eller medie på VG2?",
        answer: "Du bør velge det du liker best og føler deg mest interessert i."
    },
    {
        question: "Hvilke type matte lærer vi?",
        answer: "Vi lærer grunnleggende P matte, inkludert Excel-ark og ligninger, samt litt Python. I år tror jeg VG1 får mulighet til en egen gruppe med T matte."
    },
    {
        question: "Hvordan får man seg praksisplass?",
        answer: "Søk overalt, gi aldri opp."
    },
    {
        question: "Hva får vi eksamen i?",
        answer: "Eksamen inkluderer engelsk og naturfag i VG1, og tverrfaglig eksamen i VG2, i tillegg til norsk og samfunnskunnskap."
    },
    {
        question: "Hvordan bruker man printeren på skolen?",
        answer: "Du kan bruke skolens printer via https://utskrift.vlfk.no/end-user/ui/login."
    },
    {
        question: "Hvem er Alec, og hvordan kan jeg bli som han?",
        answer: "Alec er en dyktig IT-person. Du kan lære av hans ferdigheter og erfaringer."

    },
    {
        question: "Må man kunne koding fra før av?",
        answer: "Du trenger ikke å ha tidligere erfaring med koding."

    },
    {
        question: "Hva lærer man i teknologiforståelse?",
        answer: "I teknologiforståelse lærer vi om Raspberry Pi, nettverk, InDesign, kamera og videoredigering."
    },
    {
        question: "Kan man spørre dere om hjelp?",
        answer: "Vi står klare til å hjelpe, så ikke nøl med å spørre."
    },
    {
        question: "Lærer vi andre kodespråk enn HTML, CSS, JS og PHP?",
        answer: "Vi lærer også litt Python i matte og teknologiforståelse."
    },
    {
        question: "Er det vanskelig å kode?",
        answer: "Koding kan virke vanskelig til å begynne med, men det blir lettere etter hvert."
    },
    {
        question: "Finnes det andre database løsninger enn PHP og SQL?",
        answer: "Ja, du kan også bruke Firebase og LiteSQL."
    },
    {
        question: "Hvordan fungerer tverrfaglig eksamen?",
        answer: "Tverrfaglig eksamen krever at du viser kompetanse i flere fag ved å lage et produkt."
    },
    {
        question: "Hvordan logger man seg på for å få studietid?",
        answer: "Du kan logge deg på for å få studietid ved å besøke https://studie.asvg.no/."
    },
    {
        question: "Hva lærer man i historiefortelling?",
        answer: "I historiefortelling lærer du å bruke Photoshop, Premiere Pro og hvordan du håndterer kameraer."
    },
]

const shownList = ref<Question[]>(fullList)

function search(text: string) {
    if(text == '') return shownList.value = fullList
    let newList = []

    newList = fullList.filter(question => question.question.toLowerCase().includes(text.toLowerCase()))
    newList = [...newList, ...(fullList.filter(question => question.answer.toLowerCase().includes(text.toLowerCase())))]

    shownList.value = newList.filter((value, index, self) =>
        index === self.findIndex((t) => (
            t.answer === value.answer && t.question === value.question
        ))
)

}

</script>


<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body, * {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  box-sizing: border-box;
}

.header {
    padding: 1rem 3.2rem;

    display: flex;
    justify-content: space-between;
}

.questions {
    padding: 1rem 2.4rem;

    display: flex;
    flex-direction: column;
    gap: 1rem;
}
</style>