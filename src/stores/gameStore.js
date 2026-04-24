import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

export const useGameStore = defineStore('game', () => {
    const activeTeam = ref(localStorage.getItem('activeTeam') ? JSON.parse(localStorage.getItem('activeTeam')) : 0)
    const numberOfTeams = ref(localStorage.getItem('teams') ? JSON.parse(localStorage.getItem('teams')).length : 0)
    const teams = reactive(localStorage.getItem('teams') ? JSON.parse(localStorage.getItem('teams')) : [])
    const gameQuestions = reactive([])

    const changeActiveTeam = () => {
        if (activeTeam.value < numberOfTeams.value - 1) {
            activeTeam.value++
        } else {
            activeTeam.value = 0
        }

        localStorage.setItem('activeTeam', JSON.stringify(activeTeam.value))
    }

    const increaseScore = (score) => {
        teams[activeTeam.value].score += score
        localStorage.setItem('teams', JSON.stringify(teams))
        changeActiveTeam()
    }

    const decreaseScore = (score) => {
        teams[activeTeam.value].score -= score
        localStorage.setItem('teams', JSON.stringify(teams))
        changeActiveTeam()
    }

    const disableQuestion = (categoryIndex, questionIndex) => {
        gameQuestions[categoryIndex].questions[questionIndex].isAnswered = true
        localStorage.setItem('game', JSON.stringify(gameQuestions))
    }

    const saveTeams = () => localStorage.setItem('teams', JSON.stringify(teams))

    return { activeTeam, numberOfTeams, teams, gameQuestions, changeActiveTeam, increaseScore, decreaseScore, disableQuestion, saveTeams }
})
