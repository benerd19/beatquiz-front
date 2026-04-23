<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useDropZone } from '@vueuse/core'
import { useTemplateRef } from 'vue'
import Modal from '@/components/Modal.vue'

const dropZoneRef = useTemplateRef('dropZoneRef')
const router = useRouter()

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

useDropZone(dropZoneRef, {
    onDrop,
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
</script>
<template>
    <div class="start__wrapper">
        <form class="start__form">
            <h1 class="start__title">Start Page</h1>
            <hr class="start__divider" />
            <div class="start__teams">
                <h2 class="start__teams-title">Teams</h2>

                <div class="start__add-team" v-for="(team, index) in teams" :key="index">
                    <input type="text" placeholder="Team name" class="inp" v-model="team.title" />
                    <input type="color" v-model="team.color" />
                </div>
                <button class="btn start__add-team-btn" @click.prevent="addTeam">Add Team</button>
            </div>

            <div ref="dropZoneRef" class="start__drop-zone">Drop files here</div>

            <button class="btn" @click.prevent="startGame">Start</button>
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
        max-width: 600px;
    }

    &__form {
        background-color: #212325;
        padding: 20px;
        border: 1px solid #ffffff;
        border-radius: 8px;
        width: 100%;
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
        margin-bottom: 24px;
    }

    &__teams-title {
        font-size: 20px;
        font-weight: 600;
        color: #ffffff;
        margin-bottom: 12px;
    }

    &__add-team {
        display: flex;
        align-items: center;
        gap: 24px;
    }

    &__add-team-btn {
        padding: 12px;
        max-width: max-content;
    }

    &__drop-zone {
        width: 100%;
        min-height: 100px;
        background-color: transparent;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        font-weight: 600;
        color: #ffffff;
        border: 1px dashed #ffffff;
        border-radius: 8px;
        margin-bottom: 12px;
    }
}
</style>
