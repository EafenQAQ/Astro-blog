<template>
  <div class="navbar-container max-sm:hidden z-50" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">

    <div class="navbar w-[80vw] bg-base-100 rounded-2xl border-dashed border-2"
      :class="{ 'navbar-visible': isVisible, 'navbar-hidden': !isVisible }">
      <!-- 汉堡 -->

      <!-- logo -->
      <div class="flex-1 navbar-start">
        <a href="/" class=" max-sm:text-[14px] btn btn-ghost text-xl">Momo</a>
      </div>


      <!-- 导航路由 -->
      <div class="flex-1 navbar-end max-sm:hidden">
        <ul class="menu menu-horizontal">
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/posts">Posts</a></li>
        </ul>
      </div>

      <!-- 搜索图标 -->
      <SearchModal />
      <!-- 主题切换按钮 -->
      <label class="swap swap-rotate">
        <input v-model="isDark"  type="checkbox" class="theme-controller"
          value="synthwave" />
        <svg class="swap-off h-10 w-10 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
        </svg>
        <svg class="swap-on h-10 w-10 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
        </svg>
      </label>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import SearchModal from './Search/SearchModal.vue';
import { useTheme } from '../composables/useTheme';


const { theme, isDark, toggleTheme } = useTheme();





// 控制导航栏显示状态
const isVisible = ref(true);

// 标志变量，记录是否已经触发过鼠标移入事件
const hasMouseEntered = ref(false);

function handleMouseEnter() {
  // 如果是第一次触发鼠标移入事件，设置标志变量为 true
  if (!hasMouseEntered.value) {
    hasMouseEntered.value = true;
  }
  isVisible.value = true; // 显示导航栏
}

function handleMouseLeave() {
  // 如果已经触发过鼠标移入事件，则允许隐藏导航栏
  if (hasMouseEntered.value) {
    isVisible.value = false; // 隐藏导航栏
  }
}


</script>

<style lang="scss" scoped>
.navbar-container {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100px;
}

.navbar {
  position: absolute;
  top: 0;
  left: 50%;
  transition: transform 0.5s ease-in-out;
}

.navbar-visible {
  transform: translate(-50%, 0);
}

.navbar-hidden {
  transform: translate(-50%, -100%);
}
</style>