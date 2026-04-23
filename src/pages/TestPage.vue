<script setup>
import { ref, onMounted } from 'vue'

const audioRef = ref(null)
const playBtnRef = ref(null)
const progressRef = ref(null)
const timeDisplayRef = ref(null)

onMounted(() => {
    const audio = audioRef.value
    const playBtn = playBtnRef.value
    const progress = progressRef.value
    const timeDisplay = timeDisplayRef.value

    playBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play()
            playBtn.textContent = '⏸'
        } else {
            audio.pause()
            playBtn.textContent = '▶'
        }
    })

    audio.addEventListener('timeupdate', () => {
        const percent = (audio.currentTime / audio.duration) * 100
        progress.value = percent
        timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`
    })

    progress.addEventListener('input', () => {
        const time = (progress.value / 100) * audio.duration
        audio.currentTime = time
    })
})

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}
</script>

<template>
    <h1>Test Page</h1>
    <div class="custom-player">
        <button ref="playBtnRef">▶</button>
        <input type="range" ref="progressRef" value="0" step="0.01" />
        <span ref="timeDisplayRef">0:00 / 0:00</span>
    </div>
    <audio
        ref="audioRef"
        src="https://cdnt-preview.dzcdn.net/api/1/1/f/2/5/0/f25f03c79e74c8206716a26ceef9fcd5.mp3?hdnea=exp=1776507148~acl=/api/1/1/f/2/5/0/f25f03c79e74c8206716a26ceef9fcd5.mp3*~data=user_id=0,application_id=42~hmac=3a3ec7ed2aa2a98f7b617573b327fd7b5610a0c12444beb193dc4f814bfc8202"
    ></audio>
</template>
<style scoped lang="scss">
.custom-player {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #2c3e50;
    padding: 10px;
    border-radius: 30px;
    width: 300px;
}
button {
    background: #e67e22;
    border: none;
    color: white;
    font-size: 18px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    cursor: pointer;
}
input[type='range'] {
    flex: 1;
    height: 4px;
    -webkit-appearance: none;
    background: #ecf0f1;
    border-radius: 5px;
}
input[type='range']:focus {
    outline: none;
}
input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    background: #e67e22;
    border-radius: 50%;
    cursor: pointer;
}
span {
    color: white;
    font-family: monospace;
    font-size: 12px;
}
</style>
