<template>
    <nav>

        <!-- Bottom Icons -->
        <div class="flex gap-5 rounded-2xl ">

            <a href="https://github.com/github-newstar" target="_blank">
                <BottomIcon icon="github" />
            </a>
            <a href=" https://space.bilibili.com/31331836" target="_blank">

                <BottomIcon icon="tv" />
            </a>

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