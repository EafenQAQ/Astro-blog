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
      <ThemeToggle />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import SearchModal from './Search/SearchModal.vue';
import ThemeToggle from './ThemeToggle.vue';











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