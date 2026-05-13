<script setup>
import { Icon } from '@iconify/vue'
import { ref, watch } from 'vue'
import RadioButton from '../components/RadioButton.vue'

const value = ref(50)

watch(value, () => {
    console.log(value.value)
})
</script>
<template>
    <div class="page__wrapper">
        <div class="page__form">
            <div class="page__step">Step 1</div>
            <h2 class="page__form-title">Upload the File</h2>
            <p class="page__form-description">Description</p>
            <div ref="dropZoneRef" :class="['page__drop-zone', isDragOver ? 'page__drop-zone--active' : '']" v-if="!uploadStatus">
                <button class="page__upload-btn" @click.prevent="() => openFileDialog()">
                    <Icon icon="material-symbols-light:download-rounded" class="page__upload-icon" />
                    Upload
                </button>
                <p class="page__upload-text">Choose a fail or Drag & drop files here</p>
            </div>
        </div>
        <div class="page__form">
            <div class="page__step">Step 2</div>
            <h2 class="page__form-title">Set up your game</h2>
            <p class="page__form-description">Description</p>
            <div class="page__form-answer-order">
                <RadioButton name="1" value="The one who chose the question" id="1" />
                <RadioButton name="1" value="The one who raised their hand first" id="2" />
            </div>
        </div>
        <div class="page__form">
            <div class="page__step">Step 3</div>
            <h2 class="page__form-title">Form teams</h2>
            <p class="page__form-description">Description</p>
            <div class="page__team-creation"></div>
        </div>
    </div>
</template>
<style scoped lang="scss">
.page {
    &__wrapper {
        width: 100%;
        max-width: 1440px;
        height: 100dvh;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 16px;
    }

    &__form {
        background-color: #000400;
        width: 100%;
        max-width: 360px;
        border-bottom: 3px solid #ffffff;
        border-radius: 48px;
        display: flex;
        flex-direction: column;
        padding: 0 24px;
        min-height: 740px;
    }

    &__step-wrapper {
        width: 100%;
        display: flex;
        justify-content: center;
    }

    &__step {
        height: 40px;
        width: 80px;
        background-color: #a238ff;
        color: #ffffffde;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 12px;
        margin-top: -24px;
        transform: rotate(-5deg);
        align-self: center;
    }

    &__form-title {
        color: #ffffffde;
        margin-top: 24px;
        text-align: center;
    }
    &__form-description {
        color: #ffffffa3;
        text-align: center;
        margin-top: 8px;
    }
    &__upload-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 16px 24px;
        background-color: #2e322e;
        border-radius: 16px;
    }
    &__upload-icon {
        color: #fff;
        width: 24px;
        height: 24px;
    }
    &__drop-zone {
        width: 100%;
        flex-grow: 1;
        background-color: #151719;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 16px;
        font-size: 16px;
        font-weight: 600;
        color: #ffffffa3;
        border: 1px dashed #ffffff33;
        border-radius: 16px;
        margin: 24px 0;

        &--active {
            border-color: #a238ff;
            background-color: #2f2239;
        }
    }
    &__form-answer-order {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
}
</style>
