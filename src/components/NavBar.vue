<template>
  <div class="navbar-container z-50" @mouseenter="showNavBar" @mouseleave="hideNavBar">
    <div class="navbar w-[80vw] bg-base-100 rounded-2xl border-dashed border-2"
      :class="{ 'translate-y-0': isVisible, '-translate-y-full': !isVisible }">
      <div class="flex-1">
        <a href="/" class="btn btn-ghost text-xl">MOMO.blog</a>
      </div>
      <div class="flex gap-2">
        <input type="text" placeholder="Search" class="input input-bordered w-24 md:w-auto" />
        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full">
              <img alt="Tailwind CSS Navbar component" src="/assets/momo_head.jpg" />
            </div>
          </div>
          <ul tabindex="0" class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
            <li>
              <a class="justify-between">
                Profile
                <span class="badge">New</span>
              </a>
            </li>
            <li><a>Settings</a></li>
            <li><a>Logout</a></li>
          </ul>
        </div>
      </div>
      <!-- 主题切换按钮 -->
      <label class="swap swap-rotate">
        <input type="checkbox" class="theme-controller" value="synthwave" />
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
import { ref } from 'vue'

const isVisible = ref(false)

function showNavBar() {
  isVisible.value = true
}

function hideNavBar() {
  isVisible.value = false
}
</script>

<style lang="scss" scoped>
.navbar-container {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100px;
  /* 设置触发区域的高度 */
}

.navbar {
  position: absolute;
  top: 0;
  left: 50%;
  /* 定位到容器的水平中心 */
  transform: translate(-50%, -100%);
  /* 初始状态隐藏在视口上方并居中 */
  transition: transform 0.5s ease-in-out;
  /* 平滑动画 */
}

.navbar.translate-y-0 {
  transform: translate(-50%, 0);
  /* 鼠标进入时平移到可见位置 */
}

.navbar.-translate-y-full {
  transform: translate(-50%, -100%);
  /* 鼠标移开时隐藏 */
}
</style>
