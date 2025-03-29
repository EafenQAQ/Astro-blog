<template>
    <div id="hero" class="flex-1 my-10 flex justify-between max-sm:flex-col-reverse max-sm:gap-4 items-center w-[90%]  rounded-2xl">
        <!-- 问候语 -->
        <div class="hero rounded-2xl flex-1" :style="{ backgroundImage: `url(${currentBackground})` }">
            <div class="hero-overlay rounded-2xl bg-white/30 backdrop-blur-[2px]" :class="overlayClass"></div>
            <div class="hero-content text-center" :class="textColorClass">
                <div class="max-w-md text-black/80">
                    <h1 class="mb-5 text-3xl font-bold">{{ greeting }}</h1>
                    <p class="mb-5">
                        {{ timeSpecificMessage }}
                    </p>
                </div>
            </div>
        </div>
        <!-- 时钟 -->
        <div id="timer" class="mx-5">
            <div class="grid auto-cols-max grid-flow-col gap-5 text-center">
                <div class="bg-neutral rounded-box text-neutral-content flex flex-col p-2">
                    <span class="countdown font-mono text-5xl">
                        <span :style="{ '--value': hours }" aria-live="polite" aria-label="10">{{ hours }}</span>
                    </span>
                    hours
                </div>
                <div class="bg-neutral rounded-box text-neutral-content flex flex-col p-2">
                    <span class="countdown font-mono text-5xl">
                        <span :style="{ '--value': minutes }" aria-live="polite" aria-label="24">{{ minutes }}</span>
                    </span>
                    min
                </div>
                <div class="bg-neutral rounded-box text-neutral-content flex flex-col p-2">
                    <span class="countdown font-mono text-5xl">
                        <span :style="{ '--value': seconds }" aria-live="polite" aria-label="59">{{ seconds }}</span>
                    </span>
                    sec
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

// 定义不同时间段的背景图
const morningURL = "/assets/hero/morning.jpg";
const afternoonURL = "/assets/hero/noon.jpg";
const eveningURL = "/assets/hero/evening.jpg";
const nightURL = "/assets/hero/night.jpg";

// 响应式变量
const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);
const timeOfDay = ref('');

// 根据时间计算当前应该显示的背景图
const currentBackground = computed(() => {
    if (timeOfDay.value === 'morning') {
        return morningURL;
    } else if (timeOfDay.value === 'afternoon') {
        return afternoonURL;
    } else if (timeOfDay.value === 'evening') {
        return eveningURL;
    } else {
        return nightURL;
    }
});

// 根据时间计算问候语
const greeting = computed(() => {
    if (timeOfDay.value === 'morning') {
        return '早上好！';
    } else if (timeOfDay.value === 'afternoon') {
        return '下午好！';
    } else if (timeOfDay.value === 'evening') {
        return '傍晚好！';
    } else {
        return '晚上好！';
    }
});

// 根据时间计算具体消息内容
const timeSpecificMessage = computed(() => {
    if (timeOfDay.value === 'morning') {
        return '新的一天开始了，祝您有个美好的早晨！';
    } else if (timeOfDay.value === 'afternoon') {
        return '希望您的下午充满活力和生产力！';
    } else if (timeOfDay.value === 'evening') {
        return '傍晚时分，是放松和享受的好时光！';
    } else {
        return '夜晚已至，愿您有个平静安宁的夜晚！';
    }
});

// 根据时间计算覆盖层样式
const overlayClass = computed(() => {
    if (timeOfDay.value === 'morning') {
        return 'bg-yellow-500/10'; // 淡黄色覆盖，给人早晨阳光的感觉
    } else if (timeOfDay.value === 'afternoon') {
        return 'bg-blue-500/10'; // 淡蓝色覆盖，表示明亮的天空
    } else if (timeOfDay.value === 'evening') {
        return 'bg-orange-500/20'; // 橙色覆盖，表示日落
    } else {
        return 'bg-blue-900/30'; // 深蓝色覆盖，表示夜晚
    }
});

// 根据时间计算文字颜色
const textColorClass = computed(() => {
    if (timeOfDay.value === 'morning' || timeOfDay.value === 'afternoon') {
        return 'text-neutral-content'; // 白天使用深色文字
    } else {
        return 'text-white'; // 晚上使用白色文字
    }
});

// 获取当前时间并确定时间段
const updateCurrentTime = () => {
    const currentTime = new Date();
    hours.value = currentTime.getHours();
    minutes.value = currentTime.getMinutes();
    seconds.value = currentTime.getSeconds();

    // 确定当前时间段
    if (hours.value >= 5 && hours.value < 12) {
        timeOfDay.value = 'morning';
    } else if (hours.value >= 12 && hours.value < 17) {
        timeOfDay.value = 'afternoon';
    } else if (hours.value >= 17 && hours.value < 20) {
        timeOfDay.value = 'evening';
    } else {
        timeOfDay.value = 'night';
    }
};

let timer = null;

// 初始化
onMounted(() => {
    updateCurrentTime();
    // 每秒更新一次时间
    timer = setInterval(updateCurrentTime, 1000);
});

// 卸载时清除定时器
onUnmounted(() => {
    clearInterval(timer);
});
</script>

<style lang="scss" scoped>
.hero {
    transition: all 0.5s ease-in-out;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    height: 100%;

    .hero-overlay {
        transition: all 0.5s ease-in-out;
    }

    .hero-content {
        transition: all 0.5s ease-in-out;
    }
}
</style>