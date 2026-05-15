<script setup lang="ts">
const props = defineProps(['name', 'value', 'id', 'label', 'disabled'])
const model = defineModel()
</script>
<template>
    <div class="input__wrapper">
        <input type="radio" :id="props.id" :name="props.name" :value="props.value" class="input" v-model="model" :disabled="props.disabled" />
        <label :for="props.id" class="input__label">{{ props.label }}</label>
    </div>
</template>
<style scoped lang="scss">
.input {
    &__wrapper {
        display: inline-block;
        box-sizing: border-box;
    }
    display: none;
    &:checked + .input__label {
        background-color: #a238ff;
    }
    &__label {
        display: inline-block;
        color: #ffffffde;
        padding: 8px 16px;
        background-color: #2e322e;
        box-sizing: border-box;
        border-radius: 16px;
    }
}
</style>
