import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
interface ITeam {
    title: string
    color: string
    score: number
}

type TInitialTeams = Omit<ITeam, 'score'>

export const useTeamStore = defineStore('team', () => {
    const activeTeam = ref<number>(Number(localStorage.getItem('activeTeam')) || 0)
    const teams = reactive<ITeam[]>(JSON.parse(localStorage.getItem('teams') || '[]') || [])

    const initializeTeams = (initialTeams: TInitialTeams[]) => {
        teams.push(...initialTeams.map((team) => ({ ...team, score: 0 })))
        localStorage.setItem('teams', JSON.stringify(teams))
    }

    const dropTeams = () => {
        teams.splice(0, teams.length)
        activeTeam.value = 0
        localStorage.removeItem('activeTeam')
        localStorage.removeItem('teams')
    }

    return { activeTeam, teams, initializeTeams, dropTeams }
})
