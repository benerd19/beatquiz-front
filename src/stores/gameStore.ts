import { defineStore } from 'pinia'
import { reactive } from 'vue'

interface IQuestion {
    id: number
    value: number
    isAnswered: boolean
}

type TInitialQuestions = Omit<IQuestion, 'isAnswered'>

interface ICategories {
    title: string
    questions: IQuestion[] | TInitialQuestions[]
}

export const useGameStore = defineStore('game', () => {
    const gameQuestions = reactive<ICategories[]>([JSON.parse(localStorage.getItem('categories') || '[]')])

    // const increaseScore = (score) => {
    //     teams[activeTeam.value].score += score
    //     localStorage.setItem('teams', JSON.stringify(teams))
    //     changeActiveTeam()
    // }

    // const decreaseScore = (score) => {
    //     teams[activeTeam.value].score -= score
    //     localStorage.setItem('teams', JSON.stringify(teams))
    //     changeActiveTeam()
    // }

    // const disableQuestion = (categoryIndex, questionIndex) => {
    //     gameQuestions[categoryIndex].questions[questionIndex].isAnswered = true
    //     localStorage.setItem('game', JSON.stringify(gameQuestions))
    // }

    const initializeCategories = (initCategories: ICategories[]) => {
        const formattedCategories = []
        for (const category of initCategories) {
            formattedCategories.push({
                title: category.title,
                questions: category.questions.map((question) => ({ ...question, isAnswered: false })),
            })
        }
        gameQuestions.push(...formattedCategories)
        localStorage.setItem('categories', JSON.stringify(gameQuestions))
    }

    const dropCategories = () => {
        gameQuestions.splice(0, gameQuestions.length)
        localStorage.removeItem('categories')
    }

    return { gameQuestions, initializeCategories, dropCategories }
})
