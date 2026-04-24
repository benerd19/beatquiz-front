import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useActiveQuestion = defineStore('activeQuestion', () => {
    const rowIndex = ref(null)
    const questionIndex = ref(null)
    const trackId = ref(null)

    return { rowIndex, questionIndex, trackId }
})
