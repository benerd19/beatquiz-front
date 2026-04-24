<script setup>
import { reactive } from 'vue'
const props = defineProps(['teams'])

const shownTeams = reactive([])

shownTeams.push(props.teams.sort((a, b) => b.score - a.score))
</script>
<template>
    <div class="result__wrapper">
        <div class="result__inner">
            <h2 class="result__header">Result</h2>
            <div class="result__score-container">
                <div class="result__team" v-for="(team, index) in props.teams" :key="index" :style="{ borderTopColor: team.color }">
                    <span class="result__team-title">{{ team.title }}</span>
                    <span class="result__team-score">{{ team.score }}</span>
                </div>
                <!-- <div class="result__team">
                    <span class="result__team-title">Team 4</span>
                    <span class="result__team-score">30000</span>
                </div>
                <div class="result__team">
                    <span class="result__team-title">Team 4</span>
                    <span class="result__team-score">30000</span>
                </div>
                <div class="result__team">
                    <span class="result__team-title">Team 4</span>
                    <span class="result__team-score">30000</span>
                </div>
                <div class="result__team">
                    <span class="result__team-title">Team 4</span>
                    <span class="result__team-score">30000</span>
                </div> -->
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss">
.result {
    &__wrapper {
        width: 100%;
        display: flex;
        justify-content: center;
    }

    &__inner {
        width: 100%;
        max-width: 560px;
        border-radius: 48px;
        background-color: #000400;
        margin-top: 100px;
        padding: 24px;
    }

    &__header {
        color: #ffffffde;
        font-size: 24px;
        font-weight: 700;
        text-align: center;
    }

    &__score-container {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-top: 32px;
    }

    &__team {
        background-color: #151719;
        padding: 16px 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 16px;
        border-top: 5px solid transparent;
    }

    &__team-title {
        font-weight: 400;
        font-size: 18px;
        color: #ffffffcc;
    }

    &__team-score {
        font-weight: 400;
        font-size: 18px;
        color: #ffffff;
        font-family: 'Dela Gothic One';
    }
}
</style>
