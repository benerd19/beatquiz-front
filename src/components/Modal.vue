<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const audioRef = ref(null)
const rangeRef = ref(null)
const isPlaying = ref(false)
const currentTime = ref('0:00')
const totalDuration = ref('0:00')
const rangeValue = ref(0)

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

onUnmounted(() => {
    if (audioRef.value) {
        audioRef.value.pause()
    }
})
</script>

<template>
    <div class="modal__wrapper">
        <img src="../assets/close.svg" alt="close" class="modal__close-icon" />
        <div class="modal__inner">
            <img
                src="https://cdn-images.dzcdn.net/images/cover/39fe38574c7af3181d1e56ad7c03fce3/500x500-000000-80-0-0.jpg"
                alt="album-logo"
                class="modal__album-img"
            />
            <div class="modal__duration">
                <audio
                    ref="audioRef"
                    src="https://cdnt-preview.dzcdn.net/api/1/1/4/6/1/0/46137fd093d286cd97fd542a8654fb92.mp3?hdnea=exp=1776518478~acl=/api/1/1/4/6/1/0/46137fd093d286cd97fd542a8654fb92.mp3*~data=user_id=0,application_id=42~hmac=c11857308feb904f16e1b6513ed70a13417b93181d26d62a60644be3bdda2edb"
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
                <button class="modal__answer-btn modal__answer-btn--negative"><img src="../assets/close-svg.svg" alt="negative" /></button>
                <button @click="togglePlay" class="modal__play-btn">
                    <img src="../assets/pause.svg" alt="pause" v-if="isPlaying" />
                    <img src="../assets/play_arrow.svg" alt="pause" v-else />
                </button>
                <button class="modal__answer-btn modal__answer-btn--positive"><img src="../assets/check.svg" alt="positive" /></button>
            </div>
            <div class="modal__info">
                <p class="modal__info-title">She will be loved</p>
                <p class="modal__info-artist">Maroon 5</p>
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
}
</style>
