<script setup>
import { reactive, onMounted } from 'vue'
const teams = reactive([])

onMounted(() => {
    const storageTeams = localStorage.getItem('teams')
    if (storageTeams) teams.push(...JSON.parse(storageTeams))
    console.log(teams)
})
</script>
<template>
    <div class="grid__inner">
        <h1 class="grid__header">Name of the game</h1>
        <div class="grid">
            <div class="grid__row">
                <div class="grid__category-title">
                    <h2>Topic 1123123123123123</h2>
                </div>
                <div class="grid__rounds">
                    <div class="grid__round grid__round--disable">100</div>
                    <div class="grid__round">200</div>
                    <div class="grid__round">300</div>
                    <div class="grid__round">400</div>
                    <div class="grid__round">500</div>
                    <div class="grid__round">600</div>
                    <div class="grid__round">700</div>
                    <div class="grid__round">800</div>
                </div>
            </div>
            <div class="grid__row">
                <div class="grid__category-title">
                    <h2>Topic 1123123123123123</h2>
                </div>
                <div class="grid__rounds">
                    <div class="grid__round">100</div>
                    <div class="grid__round">200</div>
                    <div class="grid__round">300</div>
                    <div class="grid__round">400</div>
                    <div class="grid__round">500</div>
                    <div class="grid__round">600</div>
                    <div class="grid__round">700</div>
                    <div class="grid__round">800</div>
                </div>
            </div>
            <div class="grid__row">
                <div class="grid__category-title">
                    <h2>Topic 1123123123123123</h2>
                </div>
                <div class="grid__rounds">
                    <div class="grid__round">100</div>
                    <div class="grid__round">200</div>
                    <div class="grid__round">300</div>
                    <div class="grid__round">400</div>
                    <div class="grid__round">500</div>
                    <div class="grid__round">600</div>
                    <div class="grid__round">700</div>
                    <div class="grid__round">800</div>
                </div>
            </div>
            <div class="grid__row">
                <div class="grid__category-title">
                    <h2>Topic 1123123123123123</h2>
                </div>
                <div class="grid__rounds">
                    <div class="grid__round">100</div>
                    <div class="grid__round">200</div>
                    <div class="grid__round">300</div>
                    <div class="grid__round">400</div>
                    <div class="grid__round">500</div>
                    <div class="grid__round">600</div>
                    <div class="grid__round">700</div>
                    <div class="grid__round">800</div>
                </div>
            </div>
            <div class="grid__row">
                <div class="grid__category-title">
                    <h2>Topic 1123123123123123</h2>
                </div>
                <div class="grid__rounds">
                    <div class="grid__round">100</div>
                    <div class="grid__round">200</div>
                    <div class="grid__round">300</div>
                    <div class="grid__round">400</div>
                    <div class="grid__round">500</div>
                    <div class="grid__round">600</div>
                    <div class="grid__round">700</div>
                    <div class="grid__round">800</div>
                </div>
            </div>
            <div class="grid__row">
                <div class="grid__category-title">
                    <h2>Topic 1123123123123123</h2>
                </div>
                <div class="grid__rounds">
                    <div class="grid__round">100</div>
                    <div class="grid__round">200</div>
                    <div class="grid__round">300</div>
                    <div class="grid__round">400</div>
                    <div class="grid__round">500</div>
                    <div class="grid__round">600</div>
                    <div class="grid__round">700</div>
                    <div class="grid__round">800</div>
                </div>
            </div>
            <div class="grid__row">
                <div class="grid__category-title">
                    <h2>Topic 1123123123123123</h2>
                </div>
                <div class="grid__rounds">
                    <div class="grid__round">100</div>
                    <div class="grid__round">200</div>
                    <div class="grid__round">300</div>
                    <div class="grid__round">400</div>
                    <div class="grid__round">500</div>
                    <div class="grid__round">600</div>
                    <div class="grid__round">700</div>
                    <div class="grid__round">800</div>
                </div>
            </div>
            <div class="grid__row">
                <div class="grid__category-title">
                    <h2>Topic 1123123123123123</h2>
                </div>
                <div class="grid__rounds">
                    <div class="grid__round">100</div>
                    <div class="grid__round">200</div>
                    <div class="grid__round">300</div>
                    <div class="grid__round">400</div>
                    <div class="grid__round">500</div>
                    <div class="grid__round">600</div>
                    <div class="grid__round">700</div>
                    <div class="grid__round">800</div>
                </div>
            </div>
        </div>
        <div class="grid__commands">
            <div class="grid__command" v-for="(team, index) in teams" :key="index" :style="{ backgroundColor: team.color }">
                <h3 class="grid__command-title">{{ team.title }}</h3>
                <span class="grid__command-points">500</span>
            </div>
            <div class="grid__logo-wrapper">
                <img src="../assets/deezer-logo.svg" alt="logo" class="grid__logo" />
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss">
.grid {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 80dvh;

    &__inner {
        padding: 16px 16px 0;
        max-width: 1440px;
        width: 100%;
    }

    &__header {
        text-align: center;
        font-size: 40px;
        font-weight: 600;
        color: #ffffff;
        margin-bottom: 24px;
    }

    &__row {
        display: flex;
        gap: 4px;
    }

    &__category-title {
        max-width: 240px;
        font-size: 24px;
        color: #ffffff;
        border-radius: 20px;
        background-color: #2c2e30;
        // height: 90px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 12px 8px;
        flex-wrap: wrap;
        text-align: center;
        user-select: none;
    }

    &__rounds {
        display: flex;
        gap: 4px;
        width: 100%;
    }

    &__round {
        max-width: 142px;
        width: 100%;
        background-color: #2c2e30;
        border: 1px solid transparent;
        color: #fff;
        font-size: 40px;
        font-weight: 400;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        user-select: none;

        &:hover {
            border: 1px solid #ffffff;
        }

        &--disable {
            opacity: 0.3;
            cursor: default;

            &:hover {
                border: transparent;
            }
        }
    }

    &__commands {
        display: flex;
        flex-direction: row;
        gap: 4px;
        width: 100%;
        margin-top: 24px;
    }

    &__command {
        padding: 16px;
        width: 100%;
        background-color: #2b1e27;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 4px;
        border-radius: 20px;
    }

    &__command-title {
        font-size: 24px;
        color: #ffffff;
    }

    &__command-points {
        font-size: 40px;
        color: #ffffff;
    }

    &__logo-wrapper {
        width: 100%;
        max-width: 132px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #212325;
        border-radius: 20px;
    }
}
</style>
