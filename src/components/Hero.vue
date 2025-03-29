<template>
    <div id="hero" class="flex-1 w-[90%]">
        <div class="hero rounded-2xl" style="background-image: url(../assets/hero.jpg);">
            <div class="hero-overlay rounded-2xl bg-white/50 "></div>
            <div class="hero-content text-gray-800 text-center">
                <div class="max-w-md">
                    <h1 class="mb-5 text-3xl font-bold">下午好！</h1>
                    <p class="mb-5">
                        Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
                        quasi. In deleniti eaque aut repudiandae et a id nisi.
                    </p>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// 根据用户当前时间切换hero内容

//切换hero背景图
const morningURL = "../assets/hero_morning.jpg";
const afternoonURL = "../assets/hero_afternoon.jpg";
const eveningURL = "../assets/hero_evening.jpg";
</script>

<style lang="scss" scoped></style>