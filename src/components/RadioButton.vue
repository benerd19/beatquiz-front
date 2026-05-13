<script setup>
const props = defineProps(['name', 'value', 'id'])
</script>
<template>
    <div class="input__wrapper">
        <input type="radio" :id="props.id" :name="name" :value="value" class="input" />
        <label :for="props.id" class="input__label">{{ value }}</label>
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
