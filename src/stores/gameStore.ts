import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { ELocalStorage } from '../@types'
import { useTeamStore } from '../stores'
interface IQuestion {
    id: number
    value: number
    isAnswered?: boolean
}

type TInitialQuestions = Omit<IQuestion, 'isAnswered'>

interface ICategories {
    title: string
    questions: IQuestion[]
}

export const useGameStore = defineStore('game', () => {
    const { changeTeamScore, changeActiveTeam } = useTeamStore()
    const gameQuestions = reactive<ICategories[]>(JSON.parse(localStorage.getItem(ELocalStorage.CATEGORIES) || '[]'))

    const increaseScore = (score: number) => {
        changeTeamScore(score)
    }

    const decreaseScore = (score: number) => {
        changeTeamScore(-score)
    }

    const disableQuestion = (categoryIndex: number, questionIndex: number) => {
        gameQuestions[categoryIndex].questions[questionIndex].isAnswered = true
        localStorage.setItem(ELocalStorage.CATEGORIES, JSON.stringify(gameQuestions))
    }

    const initializeCategories = (initCategories: ICategories[]) => {
        const formattedCategories = []
        for (const category of initCategories) {
            formattedCategories.push({
                title: category.title,
                questions: category.questions.map((question) => ({ ...question, isAnswered: false })),
            })
        }
        gameQuestions.push(...formattedCategories)
        localStorage.setItem(ELocalStorage.CATEGORIES, JSON.stringify(gameQuestions))
    }

    const dropCategories = () => {
        gameQuestions.splice(0, gameQuestions.length)
        localStorage.removeItem(ELocalStorage.CATEGORIES)
    }

    return { gameQuestions, initializeCategories, dropCategories, increaseScore, decreaseScore, disableQuestion }
})
