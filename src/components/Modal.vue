<script setup>
import { ref, onMounted, onUnmounted, defineModel, watch } from 'vue'
import axios from 'axios'
import { useGameStore } from '@/stores/gameStore'
// import activeQuestionStore from '../stores/activeQuestionStore'

// const { rowIndex, questionIndex, trackId } = activeQuestionStore()

const { increaseScore, decreaseScore, disableQuestion } = useGameStore()
const audioRef = ref(null)
const rangeRef = ref(null)
const isPlaying = ref(false)
const currentTime = ref('0:00')
const totalDuration = ref('0:00')
const rangeValue = ref(0)
const isLoading = ref(false)

const trackInfo = ref({
    image: '',
    preview: '',
    artist: '',
    title: '',
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

const seek = (e) => {
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
const formatTime = (seconds) => {
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
}

const toggleWrongAnswer = () => {
    decreaseScore(props.modalData.question.value)
    disableQuestion(props.modalData.categoryIndex, props.modalData.questionIndex)
    isOpen.value = false
    isAnswerShow.value = false
    isPlaying.value = false
    audioRef.value.pause()
}

const toggleRightAnswer = () => {
    increaseScore(props.modalData.question.value)
    disableQuestion(props.modalData.categoryIndex, props.modalData.questionIndex)
    isOpen.value = false
    isAnswerShow.value = false
    isPlaying.value = false
    audioRef.value.pause()
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
            <div class="modal__duration">
                <audio
                    ref="audioRef"
                    :src="trackInfo.preview"
                    @timeupdate="updateProgress"
                    @loadedmetadata="onLoadedMetadata"
                    @ended="onEnded"
                ></audio>
                <input ref="rangeRef" type="range" class="modal__range" v-model="rangeValue" @input="seek" />
                <div class="modal__duration-timer">
                    <span>{{ currentTime }}</span>
                    <span>{{ totalDuration }}</span>
                </div>
            </div>
            <div class="modal__buttons">
                <button class="modal__answer-btn modal__answer-btn--negative" v-if="isAnswerShow" @click="toggleWrongAnswer">
                    <img src="../assets/close-svg.svg" alt="negative" />
                </button>
                <button @click="togglePlay" class="modal__play-btn">
                    <img src="../assets/pause.svg" alt="pause" v-if="isPlaying" />
                    <img src="../assets/play_arrow.svg" alt="pause" v-else />
                </button>
                <button class="modal__answer-btn modal__answer-btn--positive" v-if="isAnswerShow" @click="toggleRightAnswer">
                    <img src="../assets/check.svg" alt="positive" />
                </button>
            </div>
            <div class="modal__info">
                <p class="modal__info-title" v-if="isAnswerShow">{{ trackInfo.title }}</p>
                <p class="modal__info-artist" v-if="isAnswerShow">{{ trackInfo.artist }}</p>
                <button @click="isAnswerShow = true" class="modal__show-answer-btn" v-if="!isAnswerShow">Show Answer</button>
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
    }

    &__album-img {
        max-width: 320px;
        aspect-ratio: 1 / 1;
        border-radius: 20px;
        margin-top: -72px;
    }

    &__range {
        margin-top: 72px;
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
        width: 96px;
        height: 96px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 100px;
        background-color: #2e322e;
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
        gap: 8px;
        align-items: center;
        flex-wrap: wrap;
        margin-top: 32px;
        text-align: center;
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
