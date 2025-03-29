<template>
    <nav class=" h-fit max-w-[17rem] flex-1 bg-black flex flex-col items-center py-4">
        <!-- Profile Avatar -->
        <div class="mb-8">
            <img src="/assets/momo_head.jpg" alt="User Avatar"
                class="w-45 h-45 rounded-full object-cover border-2 border-blue-400" />
        </div>

        <!-- Navigation Items -->
        <div class="space-y-4 w-full">
            <NavItem v-for="(item, index) in navItems" :key="index" :icon="item.icon" :label="item.label"
                @click="selectNavItem(index)" :active="activeIndex === index" />
        </div>

        <!-- Bottom Icons -->
        <div class="my-4 flex space-y-4 gap-2 rounded-2xl px-4 pt-4 ">
            <BottomIcon icon="coffee" />
            <BottomIcon icon="github" />
            <BottomIcon icon="tv" />
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
            class: 'flex justify-center cursor-pointer text-gray-400 hover:text-white transition-colors'
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

<style scoped>
nav {
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}
</style>