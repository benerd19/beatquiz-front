<script setup>
import { reactive, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import Modal from '@/components/Modal.vue'
import ResultModal from '@/components/ResultModal.vue'
import { useGameStore } from '../stores/gameStore'
import { useRouter } from 'vue-router'
const isOpen = ref(false)
const gameTitle = ref('')
const resultModal = ref([])
const questionsLeft = ref(64)
const isEditing = ref(false)

const gameStore = useGameStore()
const { activeTeam, teams, gameQuestions } = storeToRefs(gameStore)
const { saveTeams } = gameStore
const router = useRouter()
const modalProps = ref({ question: null, index: null })

onMounted(() => {
    const storageGame = localStorage.getItem('game')
    if (!storageGame) {
        router.push('/start')
        return
    }
    const parsedRounds = JSON.parse(storageGame)

    gameTitle.value = localStorage.getItem('gameTitle')
    gameQuestions.value.push(...parsedRounds)
    countQuestionsLeft()
})

const countQuestionsLeft = () => {
    questionsLeft.value = 0
    gameQuestions.value.forEach((round) => {
        questionsLeft.value += round.questions.filter((question) => !question.isAnswered).length
    })
    console.log(questionsLeft.value)
}

const backgroundColors = reactive([
    {
        title: '#5A5826',
        round: '#3A3927',
    },
    {
        title: '#2F5E28',
        round: '#293A27',
    },
    {
        title: '#603252',
        round: '#3A2734',
    },
    {
        title: '#2B6165',
        round: '#27393A',
    },
    {
        title: '#5A5826',
        round: '#3A3927',
    },
    {
        title: '#623334',
        round: '#3A2727',
    },
    {
        title: '#2F5E28',
        round: '#293A27',
    },
    {
        title: '#453876',
        round: '#2B273A',
    },
])

watch(isOpen, () => {
    countQuestionsLeft()
    resultModal.value = teams.value.map((team, index) => ({ ...team, score: team.score, color: teamColors[index].border }))
})

watch(isEditing, () => {
    saveTeams()
})

const teamColors = reactive([
    {
        border: '#A238FF',
        background: '#2B273ACC',
    },
    {
        border: '#1FF134',
        background: '#293A27CC',
    },
    {
        border: '#F1DF1F',
        background: '#3A3927CC',
    },
    {
        border: '#F11FB0',
        background: '#3A2734CC',
    },
    {
        border: '#81E6FB',
        background: '#27393ACC',
    },
])

async function rowItemClick(question, index, idx) {
    try {
        modalProps.value = {
            question: question,
            categoryIndex: index,
            questionIndex: idx,
        }

        isOpen.value = true
    } catch (e) {
        console.log(e)
    }
}
</script>
<template>
    <div class="grid__inner">
        <div class="grid__header">
            <img src="../assets/deezer-logo.svg" alt="logo" class="grid__logo" />
            <h1 class="grid__header-title">{{ gameTitle }}</h1>
            <div class="grid__header-right">
                <img src="../assets/editB.svg" alt="edit" class="grid__edit-icon" @click="isEditing = !isEditing" />
            </div>
        </div>
        <div class="grid" v-if="questionsLeft > 0">
            <div class="grid__row" v-for="(round, index) in gameQuestions" :key="index">
                <div class="grid__category-title">
                    <h2>{{ round.title }}</h2>
                </div>
                <div class="grid__rounds">
                    <div
                        :class="['grid__round', { 'grid__round--disabled': question.isAnswered }]"
                        v-for="(question, idx) in round.questions"
                        :key="idx"
                        @click="rowItemClick(question, index, idx)"
                    >
                        {{ question.value }}
                    </div>
                </div>
            </div>
        </div>
        <div class="grid__commands" v-if="questionsLeft > 0">
            <div
                class="grid__command"
                v-for="(team, index) in teams"
                :key="index"
                :style="{ borderColor: teamColors[index].border, backgroundColor: index === activeTeam ? teamColors[index].background : '' }"
            >
                <h3 class="grid__command-title">{{ team.title }}</h3>
                <input type="text" class="grid__command-input" v-model="team.score" v-if="isEditing" />
                <span class="grid__command-points" v-else>{{ team.score }}</span>
            </div>
        </div>
        <ResultModal :teams="resultModal" v-if="questionsLeft === 0" />
    </div>
    <Modal v-model="isOpen" :modal-data="modalProps" />
</template>
<style scoped lang="scss">
.grid {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 80dvh;

    &__inner {
        padding: 0 16px;
        max-width: 1440px;
        width: 100%;
    }

    &__header {
        display: flex;
        margin-top: 16px;
        justify-content: space-between;
        margin-bottom: 8px;
    }

    &__header-title {
        text-align: center;
        font-size: 40px;
        font-weight: 600;
        color: #ffffff;
    }

    &__header-empty-block {
        width: 100px;
    }

    &__row {
        display: flex;
        gap: 4px;
    }

    &__category-title {
        max-width: 240px;
        width: 100%;
        font-size: 24px;
        color: #ffffff;
        border-radius: 20px;
        background-color: #2c2e30;
        display: flex;
        height: 90px;
        justify-content: center;
        align-items: center;
        padding: 12px 8px;
        flex-wrap: wrap;
        text-align: center;
        user-select: none;
        height: calc((80dvh - 56px) / 8);
    }

    &__rounds {
        display: flex;
        gap: 4px;
        width: 100%;
    }

    &__round {
        max-width: 142px;
        width: 100%;
        background-color: #2c2e30;
        border: 1px solid transparent;
        color: rgba(255, 255, 255, 0.87);
        font-size: 40px;
        font-weight: 400;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 20px;
        cursor: pointer;
        user-select: none;
        height: calc((80dvh - 56px) / 8);
        font-family: 'Dela Gothic One';
        transition: all 0.3s ease;

        &:hover {
            border: 1px solid #a238ff;
            background-color: #242125;
        }

        &--disabled {
            opacity: 0.3;
            cursor: default;
            pointer-events: none;

            &:hover {
                border: transparent;
            }
        }
    }

    &__commands {
        display: flex;
        flex-direction: row;
        gap: 4px;
        width: 100%;
        margin-top: 24px;
    }

    &__command {
        padding: 16px;
        width: 100%;
        background-color: #212325;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 4px;
        border-radius: 20px;
        height: 90px;
        border-top: 4px solid transparent;
    }

    &__command-title {
        font-size: 16px;
        color: #ffffff;
    }

    &__command-points {
        font-size: 24px;
        font-family: 'Dela Gothic One';
        color: rgba(255, 255, 255, 0.87);
    }

    &__logo-wrapper {
        width: 100%;
        max-width: 132px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #212325;
        border-radius: 20px;
    }

    &__edit-icon {
        cursor: pointer;
    }

    &__command-input {
        font-size: 24px;
        font-family: 'Dela Gothic One';
        color: rgba(255, 255, 255, 0.87);
    }

    &__header-right {
        width: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>
