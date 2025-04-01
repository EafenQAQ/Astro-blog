<template>
    <div>
        <button @click="scrollToTop"
            class="fixed hover:cursor-pointer z-50    bottom-4 right-4 bg-gray-100 hover:bg-gray-200 p-2 rounded-full">⬆️</button>
    </div>
</template>

<script setup>
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>

<style lang="scss" scoped></style>