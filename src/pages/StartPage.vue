<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDropZone } from '@vueuse/core'
import { useTemplateRef } from 'vue'
import DeleteIcon from '@/components/Icons/DeleteIcon.vue'
import PlusIcon from '@/components/Icons/PlusIcon.vue'
import Modal from '@/components/Modal.vue'

const uploadStatus = ref(false)
const dropZoneRef = useTemplateRef('dropZoneRef')
const router = useRouter()

const borderColors = reactive(['#A238FF', '#A2FB81', '#81E6FB', '#F11FB0', '#FFB260'])

const teams = reactive([
    {
        title: 'Team 1',
        color: '#524e55',
    },
    {
        title: 'Team 2',
        color: '#524e55',
    },
])

const isDragOver = ref(false)

useDropZone(dropZoneRef, {
    onDrop,

    onEnter: () => {
        isDragOver.value = true
    },

    onLeave: () => {
        isDragOver.value = false
    },

    onOver: (e) => {
        e.preventDefault()
    },

    dataTypes: ['application/json'],
    multiple: false,
    preventDefaultForUnhandled: false,
})

function onDrop(files) {
    console.log(files)
    const reader = new FileReader()
    reader.onload = (e) => {
        const rawContent = e.target?.result
        localStorage.setItem('game', rawContent)
        isDragOver.value = false
        uploadStatus.value = true
    }
    reader.readAsText(files[0])
}

function addTeam() {
    teams.push({
        title: `Team ${teams.length + 1}`,
        color: '#524e55',
    })
}

function startGame() {
    localStorage.setItem('teams', JSON.stringify(teams))
    router.push('/')
}

function deleteTeam(index) {
    teams.splice(index, 1)
}
</script>
<template>
    <div class="start__wrapper">
        <form class="start__form">
            <h1 class="start__title">BeatQuiz</h1>
            <div class="start__teams">
                <h2 class="start__teams-title">Teams</h2>

                <div class="start__add-team">
                    <div class="start__inp-wrapper" v-for="(team, index) in teams" :key="index" :style="{ borderColor: borderColors[index] }">
                        <input type="text" placeholder="Team name" class="start__inp" v-model="team.title" />
                        <div v-if="index > 1" @click="deleteTeam(index)" class="start__delete-icon-wrapper">
                            <DeleteIcon class="start__delete-icon" />
                        </div>
                    </div>
                </div>
                <button class="start__add-team-btn" @click.prevent="addTeam" v-if="teams.length < 5">
                    <PlusIcon />
                    Add Team
                </button>
            </div>

            <div ref="dropZoneRef" :class="['start__drop-zone', isDragOver ? 'start__drop-zone--active' : '']">
                <span> {{ uploadStatus ? 'Game uploaded' : 'Choose a file or Drag & drop files here' }} </span>
            </div>

            <button class="start__start-btn" @click.prevent="startGame">Start</button>
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
        min-height: 100px;
        background-color: #151719;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        font-weight: 600;
        color: #ffffffa3;
        border: 1px dashed #ffffff33;
        border-radius: 16px;
        margin-bottom: 12px;

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
    }
}
</style>
