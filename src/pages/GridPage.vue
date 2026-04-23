<script setup>
import { reactive, onMounted } from 'vue'
import Modal from '@/components/Modal.vue'
const teams = reactive([])
const game = reactive([])

onMounted(() => {
    const storageTeams = localStorage.getItem('teams')
    if (storageTeams) teams.push(...JSON.parse(storageTeams))

    const storageGame = localStorage.getItem('game')
    const parsedRounds = JSON.parse(storageGame).rounds

    console.log(parsedRounds)

    game.push(...parsedRounds)
})

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
</script>
<template>
    <div class="grid__inner">
        <h1 class="grid__header">Name of the game</h1>
        <div class="grid">
            <div class="grid__row" v-for="(round, index) in game" :key="index">
                <div class="grid__category-title" :style="{ backgroundColor: backgroundColors[index].title }">
                    <h2>{{ round.title }}</h2>
                </div>
                <div class="grid__rounds">
                    <div
                        class="grid__round"
                        v-for="(question, idx) in round.questions"
                        :key="idx"
                        :style="{ backgroundColor: backgroundColors[index].round }"
                    >
                        {{ question.value }}
                    </div>
                </div>
            </div>
        </div>
        <div class="grid__commands">
            <div class="grid__command" v-for="(team, index) in teams" :key="index" :style="{ backgroundColor: team.color }">
                <h3 class="grid__command-title">{{ team.title }}</h3>
                <span class="grid__command-points">500</span>
            </div>
            <div class="grid__logo-wrapper">
                <img src="../assets/deezer-logo.svg" alt="logo" class="grid__logo" />
            </div>
        </div>
    </div>
    <Modal />
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
        margin-top: 16px;
        text-align: center;
        font-size: 40px;
        font-weight: 600;
        color: #ffffff;
        margin-bottom: 8px;
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
        transition: all 0.3s ease;
        user-select: none;
        height: calc((80dvh - 56px) / 8);
        font-family: 'Dela Gothic One';

        &:hover {
            border: 1px solid #ffffff;
        }

        &--disable {
            opacity: 0.3;
            cursor: default;

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
        background-color: #2b1e27;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 4px;
        border-radius: 20px;
        height: 90px;
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
}
</style>
