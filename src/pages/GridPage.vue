<script setup>
import { reactive, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import Modal from '@/components/Modal.vue'
import ResultModal from '@/components/ResultModal.vue'
import { useRouter } from 'vue-router'
import { useTeamStore, useGameStore } from '../stores'
import { Icon } from '@iconify/vue'
import { ELocalStorage } from '../@types'

const teamStore = useTeamStore()
const gameStore = useGameStore()

const { teams, activeTeam } = storeToRefs(teamStore)
const { gameQuestions } = storeToRefs(gameStore)

const { editTeamScore } = teamStore
const isOpen = ref(false)
const gameTitle = ref('')
const resultModal = ref([])
const questionsLeft = ref(64)
const isEditing = ref(false)
const editIndex = ref(null)
const buffer = ref(0)

const router = useRouter()
const modalProps = ref({ question: null, index: null })

onMounted(() => {
    const storageGame = localStorage.getItem(ELocalStorage.CATEGORIES)
    if (!storageGame) {
        router.push('/start')
        return
    }
    gameTitle.value = localStorage.getItem(ELocalStorage.GAME_TITLE)
    countQuestionsLeft()
})

const countQuestionsLeft = () => {
    questionsLeft.value = 0
    gameQuestions.value.forEach((round) => {
        questionsLeft.value += round.questions.filter((question) => !question.isAnswered).length
    })
    console.log(questionsLeft.value)
}

watch(isOpen, () => {
    countQuestionsLeft()
    resultModal.value = teams.value.map((team, index) => ({ ...team, score: team.score, color: teamColors[index].border }))
})

const teamColors = reactive([
    {
        border: '#A238FF',
        background: '#682F99',
    },
    {
        border: '#1FF134',
        background: '#19950B',
    },
    {
        border: '#F1DF1F',
        background: '#888200',
    },
    {
        border: '#F11FB0',
        background: '#860C60',
    },
    {
        border: '#81E6FB',
        background: '#0D9EA6',
    },
])

resultModal.value = teams.value.map((team, index) => ({ ...team, score: team.score, color: teamColors[index].border }))

function editTeam(index) {
    isEditing.value = !isEditing.value
    editIndex.value = index
    buffer.value = teams.value[index].score
}

function closeEditing() {
    editIndex.value = null
}

function saveTeamScore() {
    editTeamScore(buffer.value, editIndex.value)
    closeEditing()
}

async function rowItemClick(question, index, idx) {
    modalProps.value = {
        question: question,
        categoryIndex: index,
        questionIndex: idx,
    }

    isOpen.value = true
}
</script>
<template>
    <div class="grid__inner">
        <div class="grid__header">
            <img src="../assets/deezer-logo.svg" alt="logo" class="grid__logo" />
            <h1 class="grid__header-title">{{ gameTitle }}</h1>
            <div class="grid__header-right">
                <button class="grid__exit-quiz" @click="router.push('/start')">
                    <Icon icon="material-symbols:exit-to-app" />
                </button>
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
                :style="{
                    borderColor: teamColors[index].border,
                    backgroundColor: index === activeTeam && editIndex !== index ? teamColors[index].background : '',
                }"
            >
                <div class="grid__team-info">
                    <h3 class="grid__command-title" v-if="editIndex !== index">{{ team.title }}</h3>
                    <input type="text" class="grid__command-input" v-model="buffer" v-if="editIndex === index" />
                    <span class="grid__command-points" v-else>{{ team.score }}</span>
                </div>
                <button class="grid__edit-btn" :style="{ borderColor: teamColors[index].border }" @click="editTeam(index)" v-if="editIndex !== index">
                    <Icon icon="material-symbols-light:edit" />
                </button>
                <div v-else class="grid__command-save-edit">
                    <button class="grid__command-save-button" :style="{ borderColor: teamColors[index].border }" @click="saveTeamScore">
                        <Icon icon="material-symbols-light:check" />
                    </button>
                    <button class="grid__command-save-button" :style="{ borderColor: teamColors[index].border }" @click="closeEditing">
                        <Icon icon="material-symbols-light:close" />
                    </button>
                </div>
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
    height: 80dvh;
    padding: 12px 0;

    &__inner {
        padding: 0 16px;
        max-width: 1440px;
        width: 100%;
    }

    &__header {
        display: flex;
        justify-content: space-between;
        height: 10dvh;
        padding-top: 16px;
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
        flex-grow: 1;
    }

    &__category-title {
        max-width: 320px;
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
        height: auto;
    }

    &__rounds {
        display: flex;
        gap: 4px;
        width: 100%;
    }

    &__round {
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
        height: 10dvh;
    }

    &__command {
        padding: 16px;
        width: 100%;
        background-color: #212325;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 4px;
        border-radius: 20px;
        height: 90px;
        border-top: 4px solid transparent;
        display: flex;
        justify-content: space-between;

        &:hover {
            .grid__edit-btn {
                display: flex;
            }
        }
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

    &__logo {
        width: 100%;
        max-width: 100px;
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

    &__exit-quiz {
        padding: 16px;
        border-radius: 16px;
        background-color: #212325;
        font-size: 24px;
        color: #fff;
        display: flex;
        align-items: center;
    }

    &__team-info {
        display: flex;
        flex-direction: column;
    }

    &__edit-btn,
    &__command-save-button {
        padding: 4px;
        color: #fff;
        background-color: #212325;
        display: none;
        justify-content: center;
        align-items: center;
        font-size: 24px;
        border-radius: 8px;
        border-width: 1px;
        border-style: solid;
    }

    &__command-save-button {
        display: flex;
    }

    &__command-save-edit {
        display: flex;
        gap: 8px;
    }
}
</style>
