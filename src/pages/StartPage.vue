<script setup lang="ts">
interface ITeams {
    title: string
    color: string
}

import { reactive, ref, onMounted, useTemplateRef } from 'vue'
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import { useDropZone, useFileDialog } from '@vueuse/core'
import { ELocalStorage } from '../@types'

import { useTeamStore, useGameStore } from '../stores'

const teamStore = useTeamStore()
const gameStore = useGameStore()

const { initializeCategories, dropCategories } = gameStore
const { initializeTeams, dropTeams } = teamStore
const fileName = ref<string>('')
const { open: openFileDialog, onChange } = useFileDialog({
    accept: '.json',
    multiple: false,
})

const uploadStatus = ref(false)
const dropZoneRef = useTemplateRef('dropZoneRef')
const router = useRouter()

const teamColors = reactive<string[]>(['#A238FF', '#1FF134', '#F1DF1F', '#F11FB0', '#81E6FB'])

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
        localStorage.setItem(ELocalStorage.GAME_TITLE, gameTitle)
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
        localStorage.setItem(ELocalStorage.GAME_TITLE, gameTitle)
        const gameCategories = JSON.parse(rawContent).categories
        initializeCategories(gameCategories)
        isDragOver.value = false
        uploadStatus.value = true
    }
    reader.readAsText(file[0])
})

function startGame() {
    // console.log(teams)
    initializeTeams(teams)
    router.replace('/')
}

onMounted(() => {
    dropTeams()
    dropCategories()
    localStorage.removeItem(ELocalStorage.GAME_TITLE)
})
</script>
<template>
    <div class="start__wrapper">
        <form class="start__form">
            <h1 class="start__title">BeatQuiz</h1>
            <div class="start__main">
                <div class="start__teams">
                    <h2 class="start__teams-title">Teams</h2>

                    <div class="start__add-team">
                        <div class="start__inp-wrapper" v-for="(team, index) in teams" :key="index" :style="{ borderColor: teamColors[index] }">
                            <input type="text" placeholder="Team name" class="start__inp" v-model="team.title" />
                            <div v-if="index > 1" @click="deleteTeam(index)" class="start__delete-icon-wrapper">
                                <Icon icon="material-symbols-light:delete-outline" class="start__delete-icon" />
                            </div>
                        </div>
                    </div>
                    <button class="start__add-team-btn" @click.prevent="addTeam" v-if="teams.length < 5">
                        <Icon icon="material-symbols:add-2" />
                        Add Team
                    </button>
                </div>

                <div ref="dropZoneRef" :class="['start__drop-zone', isDragOver ? 'start__drop-zone--active' : '']" v-if="!uploadStatus">
                    <button class="start__upload-btn" @click.prevent="() => openFileDialog()">
                        <Icon icon="material-symbols-light:download-rounded" class="start__upload-icon" />
                        Upload
                    </button>
                    <p class="start__upload-text">Choose a fail or Drag & drop files here</p>
                </div>
                <div class="start__uploaded-file" v-else>
                    <Icon icon="material-symbols-light:docs-outline-rounded" />
                    <p class="start__uploaded-file-name">{{ fileName }}</p>
                    <Icon
                        icon="material-symbols-light:delete-outline"
                        class="start__delete-icon start__delete-icon--uploaded"
                        @click="uploadStatus = false"
                    />
                </div>
            </div>

            <div class="start__start-btn-wrapper">
                <button class="start__start-btn" @click.prevent="startGame" :disabled="!uploadStatus">Start</button>
            </div>
        </form>
    </div>
</template>
<style scoped lang="scss">
.start {
    &__wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        max-width: 560px;
    }

    &__form {
        padding: 24px;
        border-radius: 48px;
        width: 100%;
        background-color: #000400;
        border-bottom: 3px solid #ffffff;
        min-height: 880px;
        display: flex;
        flex-direction: column;
    }

    &__title {
        text-align: center;
        font-size: 24px;
        font-weight: 600;
        color: #ffffff;
        margin-bottom: 24px;
    }

    &__divider {
        border: 1px solid #ffffff;
        margin-bottom: 12px;
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
        padding: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: max-content;
        gap: 8px;
        margin-top: 24px;
        color: #fff;
    }

    &__drop-zone {
        width: 100%;
        min-height: 160px;
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
        margin: 24px 0 12px;

        &--active {
            border-color: #a238ff;
            background-color: #2f2239;
        }
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

    &__delete-icon {
        &--uploaded {
            cursor: pointer;
        }
    }

    &__start-btn {
        width: 100%;
        padding: 16px 0;
        background-color: #982ef5;
        color: #ffffffde;
        border-radius: 16px;
        font-size: 16px;
        font-weight: 400;
        margin-top: 32px;

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

    &__start-btn-wrapper {
        display: flex;
        align-items: flex-end;
    }

    &__main {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
}
</style>
