<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { toRefs } from 'vue'
import axios from 'axios'
import { Icon } from '@iconify/vue'
// import activeQuestionStore from '../stores/activeQuestionStore'
import { useTeamStore, useGameStore } from '../stores'

// const { rowIndex, questionIndex, trackId } = activeQuestionStore()

const gameStore = useGameStore()
const teamsStore = useTeamStore()

const { disableQuestion } = gameStore
const { teams, changeTeamScore, changeActiveTeam } = teamsStore

const audioRef = ref()
const rangeRef = ref()
const isPlaying = ref(false)
const currentTime = ref('0:00')
const totalDuration = ref('0:00')
const rangeValue = ref(0)
const isLoading = ref(false)
const gettingPoints = ref()
const isAnswerCorrect = ref(false)
const isAnswered = ref(false)

const trackInfo = ref({
    image: '',
    preview: '',
    artist: '',
    title: '',
    album: '',
    artistPhoto: '',
})

const isAnswerShow = ref(false)

const props = defineProps(['modalData'])

const isOpen = defineModel()

let durationSeconds = 0

const togglePlay = () => {
    const audio = audioRef.value
    if (!audio) return

    if (audio.paused) {
        audio.play()
        isPlaying.value = true
    } else {
        audio.pause()
        isPlaying.value = false
    }
}

const updateProgress = () => {
    const audio = audioRef.value
    if (!audio || !durationSeconds) return

    const current = audio.currentTime
    const percent = (current / durationSeconds) * 100
    rangeValue.value = percent
    currentTime.value = formatTime(current)

    // Обновляем CSS-переменную для градиента
    if (rangeRef.value) {
        rangeRef.value.style.setProperty('--progress-percent', `${percent}%`)
    }
}

const onLoadedMetadata = () => {
    const audio = audioRef.value
    if (!audio) return
    durationSeconds = audio.duration
    totalDuration.value = formatTime(durationSeconds)
}

const seek = (e: any) => {
    const audio = audioRef.value
    if (!audio || !durationSeconds) return

    const percent = parseFloat(e.target.value)
    const newTime = (percent / 100) * durationSeconds
    audio.currentTime = newTime
    currentTime.value = formatTime(newTime)

    rangeValue.value = percent
    if (rangeRef.value) {
        rangeRef.value.style.setProperty('--progress-percent', `${percent}%`)
    }
}

// Форматирование времени (секунды -> mm:ss)
const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

const onEnded = () => {
    isPlaying.value = false
}

const closeModal = () => {
    isOpen.value = false
    isAnswerShow.value = false
    isPlaying.value = false
    audioRef.value.pause()
    gettingPoints.value = 0
    isAnswerCorrect.value = false
    isAnswered.value = false
}

const showInfo = () => {
    isAnswerShow.value = true
    disableQuestion(props.modalData.categoryIndex, props.modalData.questionIndex)
}

const changeBackground = (points: number) => {
    gettingPoints.value = points
    isAnswerCorrect.value = points < 0 ? false : true
    isAnswered.value = true
}

const changeScore = (index: number) => {
    changeTeamScore(gettingPoints.value, index)
    if (gettingPoints.value > 0) {
        changeActiveTeam(index)
    }
    closeModal()
}

watch(isOpen, async () => {
    try {
        console.log(props.modalData)
        isLoading.value = true
        const { data } = await axios.get(`https://beatquiz-back.vercel.app/song/${props.modalData.question.id}`)
        console.log(data)
        trackInfo.value = {
            image: data.image,
            preview: data.preview,
            artist: data.artist,
            title: data.title,
            album: data.album,
            artistPhoto: data.artistPhoto,
        }
    } catch (e) {
        console.log(e)
    } finally {
        isLoading.value = false
    }
})

onUnmounted(() => {
    if (audioRef.value) {
        audioRef.value.pause()
    }
})
</script>

<template>
    <div class="modal__wrapper" v-if="isOpen">
        <img src="../assets/close.svg" alt="close" class="modal__close-icon" @click="closeModal" />
        <div class="spinner" v-show="isLoading"></div>
        <div :class="['modal__container', { 'modal__container--flipped': isAnswered }]">
            <div class="modal__inner" v-show="!isLoading">
                <div class="modal__album-wrapper" :class="{ 'is-flipped': isAnswerShow }">
                    <div class="modal__album-inner">
                        <div class="modal__album-front">
                            <img src="../assets/image 1.png" alt="fallback" />
                        </div>
                        <div class="modal__album-back">
                            <img :src="trackInfo.image" alt="album-logo" />
                        </div>
                    </div>
                </div>
                <div class="modal__player-container">
                    <button @click="togglePlay" class="modal__play-btn">
                        <Icon icon="material-symbols:play-arrow" v-if="!isPlaying" class="modal__play-icon" />
                        <Icon icon="material-symbols:pause" v-else class="modal__play-icon" />
                    </button>
                    <div class="modal__duration">
                        <audio
                            ref="audioRef"
                            :src="trackInfo.preview"
                            @timeupdate="updateProgress"
                            @loadedmetadata="onLoadedMetadata"
                            @ended="onEnded"
                        />
                        <input ref="rangeRef" type="range" class="modal__range" v-model="rangeValue" @input="seek" />
                        <div class="modal__duration-timer">
                            <span>{{ currentTime }}</span>
                            <span>{{ totalDuration }}</span>
                        </div>
                    </div>
                </div>
                <div class="modal__info" v-show="isAnswerShow">
                    <p class="modal__info-title">{{ trackInfo.title }}</p>
                    <p class="modal__info-album">{{ trackInfo.album }}</p>
                    <div class="modal__info-artist-wrapper">
                        <img :src="trackInfo.artistPhoto" alt="artist-logo" class="modal__info-artist-logo" />
                        <p class="modal__info-artist-name">{{ trackInfo.artist }}</p>
                    </div>
                </div>
                <button @click="showInfo" class="modal__show-answer-btn" v-if="!isAnswerShow">Show Answer</button>
                <div class="modal__points-wrapper" v-show="isAnswerShow">
                    <p class="modal__points-title">Points</p>
                    <div class="modal__points-buttons">
                        <button class="modal__points-button modal__points-button--mistake" @click="changeBackground(-props.modalData.question.value)">
                            {{ -props.modalData.question.value }}
                        </button>
                        <button class="modal__points-button" @click="changeBackground(props.modalData.question.value)">
                            {{ props.modalData.question.value }}
                        </button>
                        <button
                            class="modal__points-button modal__points-button--double"
                            @click="changeBackground(props.modalData.question.value * 2)"
                        >
                            {{ props.modalData.question.value * 2 }}
                        </button>
                    </div>
                </div>
            </div>
            <div :class="['modal__answer-back', isAnswerCorrect ? 'modal__answer-back--correct' : 'modal__answer-back--wrong']">
                <div class="modal__answer-teams-wrapper">
                    <p class="modal__answer-teams-title">Select the team to award points to</p>
                    <div class="modal__answer-teams">
                        <button class="modal__answer-teams-btn" v-for="(team, index) in teams" :key="index" @click="changeScore(index)">
                            {{ team.title }}
                        </button>
                    </div>
                </div>
                <div class="modal__answer-points-wrapper">
                    <span class="modal__answer-points">{{ isAnswerCorrect ? '+' : '' }}{{ gettingPoints }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.modal {
    &__wrapper {
        position: fixed;
        width: 100%;
        height: 100dvh;
        background-color: rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(4px);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    &__close-icon {
        position: absolute;
        right: 16px;
        top: 16px;
        cursor: pointer;
    }

    &__inner {
        max-width: 480px;
        width: 100%;
        border-radius: 48px;
        background-color: #000400;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0 24px;
        min-height: 800px;
        position: absolute;
        top: -390px;
        backface-visibility: hidden;
    }

    &__container {
        max-width: 480px;
        width: 100%;
        transform-style: preserve-3d;
        transition: transform 0.6s;
        display: flex;
        justify-content: center;
        align-items: center;

        &--flipped {
            transform: rotateY(180deg);
        }
    }

    &__album-img {
        max-width: 320px;
        aspect-ratio: 1 / 1;
        border-radius: 20px;
        margin-top: -72px;
    }

    &__range {
        cursor: pointer;

        --progress-percent: 0%;
        background: linear-gradient(to right, #982ef5 0%, #982ef5 var(--progress-percent), #2e312e var(--progress-percent), #2e312e 100%);

        -webkit-appearance: none;
        width: 100%;
        height: 6px;
        border-radius: 100px;

        &::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 16px;
            height: 16px;
            background: #982ef5;
            border-radius: 50%;
            cursor: pointer;
        }
    }

    &__duration {
        width: 100%;
    }

    &__duration-timer {
        margin-top: 8px;
        width: 100%;
        display: flex;
        justify-content: space-between;

        span {
            color: rgba(255, 255, 255, 0.67);
            font-size: 12px;
        }
    }

    &__buttons {
        margin-top: 32px;
        display: flex;
        justify-content: center;
        gap: 16px;
        align-items: center;

        button {
            color: #fff;
        }
    }

    &__play-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 8px;
        background-color: #2e322e;
        padding: 8px;
    }

    &__answer-btn {
        width: 80px;
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 100px;
        background-color: #2e322e;

        &--positive {
            background-color: #2f5e28;
        }

        &--negative {
            background-color: #623334;
        }
    }

    &__info {
        display: flex;
        flex-direction: column;
        gap: 16px;
        align-items: center;
        flex-wrap: wrap;
        margin-top: 32px;
        text-align: center;
        width: 100%;
        max-width: 384px;
    }

    &__info-title {
        color: #ffffff;
        font-size: 32px;
        font-weight: 600;
    }

    &__info-artist {
        color: rgb(255, 255, 255, 0.67);
        font-size: 20px;
    }

    &__album-wrapper {
        width: 320px;
        height: 320px;
        perspective: 800px;
        margin-top: -60px;
    }

    &__album-inner {
        position: relative;
        width: 100%;
        height: 100%;
        transition: transform 0.6s ease;
        transform-style: preserve-3d;
    }

    &__show-answer-btn {
        padding: 16px 32px;
        color: #ffffffde;
        background-color: #2e322e;
        border-radius: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        font-size: 14px;
        font-weight: 400;
        margin-top: 80px;
    }

    &__answer-back {
        max-width: 480px;
        width: 100%;
        border-radius: 48px;
        background-color: #000400;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0 24px;
        min-height: 800px;
        position: absolute;
        top: -390px;
        backface-visibility: hidden;
        transform: rotateY(180deg);

        &--wrong {
            box-shadow: inset 2px 4px 100px 80px#361111;
        }

        &--correct {
            box-shadow: inset 2px 4px 100px 80px#163611;
        }
    }

    &__player-container {
        display: flex;
        width: 100%;
        margin-top: 72px;
        align-items: center;
        gap: 24px;
    }

    &__play-icon {
        font-size: 36px;
        color: #fff;
    }

    &__info-album {
        padding: 8px 16px;
        background-color: #212325;
        color: #ffffffa3;
        border-radius: 16px;
        width: 100%;
    }

    &__info-artist-wrapper {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
        align-items: center;
    }

    &__info-artist-logo {
        max-width: 56px;
        aspect-ratio: 1 / 1;
        border-radius: 100px;
    }
    &__info-artist-name {
        color: #ffffffa3;
        font-weight: 400;
        font-size: 16px;
    }

    &__points-wrapper {
        margin: 32px 0 12px;
        padding: 24px 0 32px;
        background-color: #212325;
        border-radius: 24px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 22px;
    }

    &__points-title {
        color: #ffffff;
        font-weight: 500;
        font-size: 20px;
    }

    &__points-buttons {
        width: 100%;
        display: flex;
        justify-content: center;
        gap: 8px;
    }

    &__points-button {
        width: 100%;
        max-width: 100px;
        padding: 24px 0;
        border-radius: 1000px;
        color: #ffffff;
        background-color: #2f5e28;
        font-size: 24px;
        font-weight: 700;

        &--mistake {
            background-color: #623334;
        }

        &--double {
            background-color: #38a628;
        }
    }

    &__answer-teams-wrapper {
        margin-top: 60px;
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 16px;
        align-items: center;
    }

    &__answer-teams-title {
        color: #ffffff;
        font-weight: 700;
        font-size: 24px;
    }

    &__answer-teams {
        width: 100%;
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        justify-content: center;
    }

    &__answer-teams-btn {
        padding: 16px;
        background-color: #2e322e;
        border-radius: 16px;
        font-size: 16px;
        color: #ffffffde;
    }

    &__answer-points-wrapper {
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 120px;
    }

    &__answer-points {
        color: #ffffff;
        font-weight: 700;
        font-size: 72px;
    }
}

.modal__album-wrapper.is-flipped .modal__album-inner {
    transform: rotateY(180deg);
}

/* Общие стили для лицевой и обратной стороны */
.modal__album-front,
.modal__album-back {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backface-visibility: hidden; /* скрываем оборотную сторону */
    border-radius: 12px; /* по желанию */
    overflow: hidden;
}

/* Задняя сторона изначально повёрнута */
.modal__album-back {
    transform: rotateY(180deg);
}

/* Картинки растягиваем по контейнеру */
.modal__album-front img,
.modal__album-back img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid #982ef5; /* цвет можно заменить на ваш акцентный */
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); /* центрируем */
    z-index: 1;
}

@keyframes spin {
    to {
        transform: translate(-50%, -50%) rotate(360deg);
    }
}
</style>
