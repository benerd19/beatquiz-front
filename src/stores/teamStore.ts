import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { ELocalStorage } from '../@types'
interface ITeam {
    title: string
    color: string
    score: number
}

type TInitialTeams = Omit<ITeam, 'score'>

export const useTeamStore = defineStore('team', () => {
    const activeTeam = ref<number>(Number(localStorage.getItem(ELocalStorage.ACTIVE_TEAM)) || 0)
    const teams = reactive<ITeam[]>(JSON.parse(localStorage.getItem(ELocalStorage.TEAMS) || '[]') || [])

    const initializeTeams = (initialTeams: TInitialTeams[]) => {
        teams.push(...initialTeams.map((team) => ({ ...team, score: 0 })))
        localStorage.setItem(ELocalStorage.TEAMS, JSON.stringify(teams))
    }

    const changeTeamScore = (score: number, teamIndex: number = activeTeam.value) => {
        teams[teamIndex].score += score
        localStorage.setItem(ELocalStorage.TEAMS, JSON.stringify(teams))
    }

    const dropTeams = () => {
        teams.splice(0, teams.length)
        activeTeam.value = 0
        localStorage.removeItem(ELocalStorage.ACTIVE_TEAM)
        localStorage.removeItem(ELocalStorage.TEAMS)
    }

    const changeActiveTeam = (index: number) => {
        activeTeam.value = index
        localStorage.setItem(ELocalStorage.ACTIVE_TEAM, String(index))
    }

    return { activeTeam, teams, initializeTeams, dropTeams, changeTeamScore, changeActiveTeam }
})
