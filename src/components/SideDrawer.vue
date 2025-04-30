<template>
    <div id="SideDrawer"
        class="drawer flex justify-between items-center sm:hidden rounded-xl bg-white/30 backdrop-blur-sm sticky top-0 z-50">

        <input id="my-drawer" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content">
            <!-- Page content here -->
            <label for="my-drawer" class="btn btn-ghost sticky drawer-button">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    class="inline-block h-5 w-5 stroke-current">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16">
                    </path>
                </svg>
            </label>
        </div>
        <!-- 侧面菜单栏 -->
        <div class="drawer-side">
            <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
            <ul class="menu bg-base-200 text-base-content min-h-full w-60 p-4">
                <!-- Sidebar content here -->
                <li><a href="/">Home</a></li>
                <li><a href="/about">about</a></li>
                <li><a href="/posts">Posts</a></li>
            </ul>
        </div>
        <!-- logo -->
        <div class="flex-1">
            <h2 class=" font-semibold">Momo</h2>
        </div>
        <!-- 搜索图标 -->
        <SearchModal />
        <ThemeToggle />
    </div>
</template>

<script setup>
import SearchModal from './Search/SearchModal.vue';
import { ref, onMounted } from 'vue';
import ThemeToggle from './ThemeToggle.vue';









</script>

<style lang="scss" scoped></style>