<template>
    <nav class=" h-fit max-w-xl flex-1 bg-white/0 flex flex-col w-full rounded-3xl items-center py-4">
        <!-- Profile Avatar -->
        <div @click="StartAnime" class="Momo mb-8 hover:scale-110 transition-all ease duration-100">
            <img src="/assets/momo_head.jpg" alt="User Avatar"
                class="w-40 h-40 rounded-full object-cover border-2 border-blue-400" />
        </div>

        <!-- Profile 文本 -->
        <div class="flex flex-col px-4 gap-4 items-center  w-full">
            <h1 class="text-4xl font-semibold text-blue-800">MOMO</h1>
            <p class="text-base-content">Momo是一个一个一个Homo, 希望能够成为一个一个很勇的Homo</p>
        </div>



        <!-- Bottom Icons -->
        <div class="my-4 flex space-y-4 gap-15 rounded-2xl px-4 pt-4 ">
            <BottomIcon icon="coffee" />
            <a href="https://github.com/github-newstar" target="_blank">
                <BottomIcon icon="github" />
            </a>
            <a href=" https://space.bilibili.com/31331836" target="_blank">

                <BottomIcon icon="tv" />
            </a>
            <BottomIcon icon="rss" />
        </div>
    </nav>
</template>

<script setup>
import { ref, defineComponent, h } from 'vue'
import { Home, Info, FileText, Code, Users, Mail } from 'lucide-vue-next'
import {
    Coffee,
    Github,
    Tv,
    Rss
} from 'lucide-vue-next'





// Components
const NavItem = defineComponent({
    props: ['icon', 'label', 'active'],
    setup(props, { emit }) {
        return () => h('div', {
            class: [
                'w-full flex items-center justify-center py-3 cursor-pointer',
                'transition-all duration-300 ease-in-out',
                props.active
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-blue-500/50 text-gray-300 hover:text-white'
            ],
            onClick: () => emit('click')
        }, [
            h(props.icon, {
                class: 'w-6 h-6',
                strokeWidth: 1.5
            })
        ])
    }
})

const BottomIcon = defineComponent({
    props: ['icon'],
    setup(props) {
        const iconMap = {
            'coffee': Coffee,
            'github': Github,
            'tv': Tv,
            'rss': Rss
        }


        return () => h('div', {
            class: 'flex justify-center cursor-pointer text-base-content hover:text-gray-400 transition-colors'
        }, [
            h(iconMap[props.icon], {
                class: 'w-6 h-6',
                strokeWidth: 1.5
            })
        ])
    }
})

// Navigation Items Configuration
const navItems = [
    { icon: Home, label: 'Home' },
    { icon: Info, label: 'About' },
    { icon: FileText, label: 'Blogs' },
    { icon: Code, label: 'Projects' },
    { icon: Users, label: 'Friends' },
    { icon: Mail, label: 'Contact' }
]

// Active Navigation State
const activeIndex = ref(0)

// Navigation Item Selection
const selectNavItem = (index) => {
    activeIndex.value = index
    // Add navigation logic here
}
</script>

<style scoped></style>