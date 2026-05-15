<script setup lang="ts">
interface ITeams {
    title: string
    color: string
}
import { Icon } from '@iconify/vue'
import { ref, watch, reactive, useTemplateRef } from 'vue'
import RadioButton from '../components/RadioButton.vue'
import { useDropZone, useFileDialog } from '@vueuse/core'
import { useTeamStore, useGameStore } from '../stores'
import { useRouter } from 'vue-router'

const teamStore = useTeamStore()
const gameStore = useGameStore()

const { initializeCategories, dropCategories } = gameStore
const { initializeTeams, dropTeams } = teamStore

const { open: openFileDialog, onChange } = useFileDialog({
    accept: '.json',
    multiple: false,
})

const router = useRouter()

const uploadStatus = ref(false)

const fileName = ref<string>('')

const dropZoneRef = useTemplateRef('dropZoneRef')

const teamColors = reactive(['#A238FF', '#1FF134', '#F1DF1F', '#F11FB0', '#81E6FB'])

const teams = reactive(<ITeams[]>[
    {
        title: 'Team 1',
        color: '#A238FF',
    },
    {
        title: 'Team 2',
        color: '#A2FB81',
    },
])

const firstAnswer = ref(1)
const secondAnswer = ref(1)

function addTeam() {
    const teamLength = teams.length
    teams.push({
        title: `Team ${teamLength + 1}`,
        color: teamColors[teamLength],
    })
}

function deleteTeam(index: number) {
    teams.splice(index, 1)
}

const isDragOver = ref(false)

useDropZone(dropZoneRef, {
    onDrop,
    onEnter: () => {
        isDragOver.value = true
    },

    onLeave: () => {
        isDragOver.value = false
    },

    dataTypes: ['application/json'],
    multiple: false,
    preventDefaultForUnhandled: false,
})

function onDrop(files: null | File[]) {
    if (!files || files.length === 0) return
    fileName.value = files[0].name
    const reader = new FileReader()
    reader.onload = (e) => {
        const rawContent = e.target?.result as string
        const gameTitle = JSON.parse(rawContent).title
        localStorage.setItem('gameTitle', gameTitle)
        const gameCategories = JSON.parse(rawContent).categories
        initializeCategories(gameCategories)
        isDragOver.value = false
        uploadStatus.value = true
    }
    reader.readAsText(files[0])
}

onChange((file) => {
    if (!file || file.length === 0) return
    fileName.value = file[0].name
    const reader = new FileReader()
    reader.onload = (e) => {
        const rawContent = e.target?.result as string
        const gameTitle = JSON.parse(rawContent).title
        localStorage.setItem('gameTitle', gameTitle)
        const gameCategories = JSON.parse(rawContent).categories
        initializeCategories(gameCategories)
        isDragOver.value = false
        uploadStatus.value = true
    }
    reader.readAsText(file[0])
})

function startGame() {
    console.log(teams)
    initializeTeams(teams)
    router.replace('/')
}
</script>
<template>
    <div class="page__wrapper">
        <div class="page__inner">
            <div class="page__form">
                <div class="page__step">Step 1</div>
                <h2 class="page__form-title">Upload the File</h2>
                <p class="page__form-description">Description</p>
                <div ref="dropZoneRef" :class="['page__drop-zone', isDragOver ? 'page__drop-zone--active' : '']" v-if="!uploadStatus">
                    <button class="page__upload-btn" @click.prevent="() => openFileDialog()">
                        <Icon icon="material-symbols-light:download-rounded" class="page__upload-icon" />
                        Upload
                    </button>
                    <p class="page__upload-text">Choose or Drag & drop files here</p>
                </div>
                <div class="page__uploaded-file" v-else>
                    <Icon icon="material-symbols-light:docs-outline-rounded" />
                    <p class="page__uploaded-file-name">{{ fileName }}</p>
                    <Icon
                        icon="material-symbols-light:delete-outline"
                        class="page__delete-icon page__delete-icon--uploaded"
                        @click="uploadStatus = false"
                    />
                </div>
            </div>
            <div class="page__form">
                <div class="page__step">Step 2</div>
                <h2 class="page__form-title">Set up your game</h2>
                <p class="page__form-description">Description</p>
                <div class="page__form-radio-wrapper">
                    <h3 class="page__form-radio-title">Who will answer</h3>
                    <div class="page__form-answer-order">
                        <RadioButton name="1" value="1" id="1" label="The one who chose the question" v-model="firstAnswer" />
                        <RadioButton name="1" value="2" id="2" label="The one who raised their hand first" v-model="firstAnswer" />
                    </div>
                </div>
                <div class="page__form-radio-wrapper">
                    <h3 class="page__form-radio-title">Who chooses the next question</h3>
                    <div class="page__form-answer-order">
                        <RadioButton name="2" value="1" id="3" label="The game is played in turns" v-model="secondAnswer" />
                        <RadioButton name="2" value="2" id="4" label="The person who answered previously" v-model="secondAnswer" />
                    </div>
                </div>
            </div>
            <div class="page__form">
                <div class="page__step">Step 3</div>
                <h2 class="page__form-title">Form teams</h2>
                <p class="page__form-description">Description</p>
                <div class="page__team-creation">
                    <h3 class="page__team-creation-title">Enter team’s name</h3>
                    <div class="page__add-team">
                        <div class="page__inp-wrapper" v-for="(team, index) in teams" :key="index" :style="{ borderColor: teamColors[index] }">
                            <input type="text" placeholder="Team name" class="page__inp" v-model="team.title" />
                            <div v-if="index > 1" @click="deleteTeam(index)" class="page__delete-icon-wrapper">
                                <Icon icon="material-symbols-light:delete-outline" class="page__delete-icon" />
                            </div>
                        </div>
                    </div>
                    <button class="page__add-team-btn" @click.prevent="addTeam" v-if="teams.length < 5">
                        <Icon icon="material-symbols:add-2" />
                        Add Team
                    </button>
                </div>
            </div>
        </div>
        <button class="page__start-btn" :disabled="!uploadStatus" @click.prevent="startGame">Start</button>
    </div>
</template>
<style scoped lang="scss">
.page {
    &__wrapper {
        width: 100%;
        max-width: 1440px;
        height: 100dvh;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 16px;
    }

    &__inner {
        display: flex;
        gap: 16px;
    }

    &__form {
        background-color: #000400;
        width: 100%;
        max-width: 360px;
        border-bottom: 3px solid #ffffff;
        border-radius: 48px;
        display: flex;
        flex-direction: column;
        padding: 0 24px;
        min-height: 740px;
    }

    &__step-wrapper {
        width: 100%;
        display: flex;
        justify-content: center;
    }

    &__step {
        height: 40px;
        width: 80px;
        background-color: #a238ff;
        color: #ffffffde;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 12px;
        margin-top: -24px;
        transform: rotate(-5deg);
        align-self: center;
    }

    &__form-title {
        color: #ffffffde;
        margin-top: 24px;
        text-align: center;
    }
    &__form-description {
        color: #ffffffa3;
        text-align: center;
        margin-top: 8px;
    }
    &__upload-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 16px 24px;
        background-color: #2e322e;
        border-radius: 16px;
    }
    &__upload-icon {
        color: #fff;
        width: 24px;
        height: 24px;
    }
    &__drop-zone {
        width: 100%;
        flex-grow: 1;
        background-color: #151719;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 16px;
        font-size: 16px;
        font-weight: 600;
        color: #ffffffa3;
        border: 1px dashed #ffffff33;
        border-radius: 16px;
        margin: 24px 0;

        &--active {
            border-color: #a238ff;
            background-color: #2f2239;
        }
    }
    &__form-answer-order {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    &__form-radio-wrapper {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-top: 32px;
    }

    &__form-radio-title {
        color: #ffffffde;
    }

    &__teams {
        margin-top: 32px;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 24px;
        min-height: 503px;
    }

    &__teams-title {
        font-size: 20px;
        font-weight: 600;
        color: #ffffff;
        margin-bottom: 24px;
        width: 100%;
    }

    &__add-team {
        display: flex;
        align-items: center;
        flex-direction: column;
        gap: 16px;
        width: 100%;
    }

    &__add-team-btn {
        padding: 16px 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: max-content;
        gap: 8px;
        color: #fff;
        align-self: center;
        background-color: #2e322e;
        border-radius: 16px;
    }

    &__inp {
        color: #ffffffcc;
        width: 100%;
    }

    &__inp-wrapper {
        display: flex;
        width: 100%;
        background-color: #151719;
        padding: 12px 24px 16px;
        border-radius: 16px;
        border-top: 4px solid red;
    }

    &__delete-icon-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 4px;
        flex-shrink: 0;
        cursor: pointer;
        width: 32px;
        height: 32px;
        border-radius: 8px;
        transition: all 0.3s ease-in-out;

        &:hover {
            background-color: #2e322e;
        }

        & svg {
            color: #fff;
            width: 24px;
            height: 24px;
        }
    }

    &__team-creation {
        display: flex;
        flex-direction: column;
        gap: 24px;
    }

    &__team-creation-title {
        color: #ffffffde;
    }

    &__start-btn {
        margin-top: 48px;
        background-color: #982ef5;
        width: 100%;
        max-width: 512px;
        padding: 16px 0;
        color: #ffffffde;
        border-radius: 16px;

        &:disabled {
            background-color: #808080;
            color: #626262;
        }
    }

    &__upload-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 16px 24px;
        background-color: #2e322e;
        border-radius: 16px;
    }

    &__upload-icon {
        color: #fff;
        width: 24px;
        height: 24px;
    }

    &__upload-text {
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        color: #ffffffa3;
    }

    &__uploaded-file {
        width: 100%;
        padding: 16px;
        border: 1px solid #2e322e;
        border-radius: 16px;
        display: flex;
        justify-content: space-between;
        gap: 8px;
        align-items: center;

        & svg {
            color: #fff;
            width: 24px;
            height: 24px;
        }
    }

    &__uploaded-file-name {
        width: 100%;
        text-align: left;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        color: #ffffffde;
    }
}
</style>
