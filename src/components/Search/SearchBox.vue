<template>
    <div id="SearchBox" class="mb-10">
        <div>
            <form action="/search" method="get" id="search-container" @mouseenter="handleMouseEnter"
                @mouseleave="handleMouseLeave" class=" flex flex-row-reverse">
                <!-- 搜索icon -->
                <button type="submit" class="hover:cursor-pointer p-2 rounded-full relative right-10 z-30">

                    <svg t="1743943079526" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="9424" width="25" height="25">
                        <path
                            d="M447.325002 129.919978c-178.868807 0-323.872319 145.003512-323.872319 323.874365s145.003512 323.874365 323.872319 323.874365c178.870854 0 323.874365-145.003512 323.874365-323.874365S626.195855 129.919978 447.325002 129.919978zM447.325002 713.712071c-143.31915 0-259.915681-116.598578-259.915681-259.917728s116.596532-259.917728 259.915681-259.917728 259.917728 116.598578 259.917728 259.917728S590.643128 713.712071 447.325002 713.712071z"
                            fill="#707070" p-id="9425"></path>
                        <path
                            d="M891.573945 840.061734 748.236376 696.699606c-13.43601 16.625656-28.371164 31.91385-44.338834 46.099944l142.458549 142.481062c6.246261 6.246261 14.427594 9.368368 22.60995 9.368368s16.363689-3.123131 22.60995-9.368368C904.065444 872.789113 904.065444 852.553233 891.573945 840.061734z"
                            fill="#707070" p-id="9426"></path>
                    </svg>
                </button>

                <!-- 搜索框本体 -->
                <input name="s" type="text" id="search-box" class="px-5 py-2 w-10  
                     focus:outline-none border rounded-full focus:ring-2 focus:ring-blue-500
                    focus:shadow-2xl  focus:shadow-blue-500/50 focus:w-50 transition-all ease duration-300"
                    placeholder="" :class="{ 'w-50': showInputBox }" v-model="searchText">
            </form>
        </div>

    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

defineProps({
    allPosts: {
        type: Array,
        default: () => { },
    }
})


const showInputBox = ref(false)
const searchText = ref('')
const handleMouseEnter = () => {
    showInputBox.value = true;
}

const handleMouseLeave = () => {
    showInputBox.value = false;
}

</script>

<style scoped>
/* #search-box {
    transition: all ease 0.2s;

} */
</style>