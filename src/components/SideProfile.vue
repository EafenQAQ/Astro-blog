<template>
    <nav class=" h-fit bg-white/30
         backdrop-blur-md flex-1 flex flex-col w-full rounded-3xl items-center py-4">
        <!-- Profile Avatar -->
        <div class="mb-8">
            <img src="/assets/momo_head.jpg" alt="User Avatar"
                class="w-40 h-40 rounded-full object-cover border-2 border-blue-400" />
        </div>

        <!-- Profile 文本 -->
        <div class="flex flex-col px-4 gap-4 items-center  w-full">
            <div class="text-4xl font-semibold text-blue-800">MOMO</div>
            <p class="text-gray-500">Momo是一个一个一个Homo, 希望能够成为一个一个很勇的Homo</p>
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

        <button @click="handleRotate" class="btn btn-ghost btn-circle">
            <svg t="1743933536053" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                p-id="4742" width="32" height="32">
                <path
                    d="M421.12 590.506667L362.666667 648.533333a329.386667 329.386667 0 0 1 23.466666-409.173333 8.533333 8.533333 0 0 0-9.813333-13.226667 310.186667 310.186667 0 0 0-83.2 492.373334L241.92 768a17.066667 17.066667 0 0 0 11.946667 29.013333h179.2a17.066667 17.066667 0 0 0 17.066666-17.066666v-179.2a17.066667 17.066667 0 0 0-29.013333-10.24zM602.88 433.493333L661.333333 375.466667a329.386667 329.386667 0 0 1-21.333333 409.173333 8.533333 8.533333 0 0 0 9.813333 13.226667 310.186667 310.186667 0 0 0 81.066667-492.373334L782.08 256a17.066667 17.066667 0 0 0-11.946667-29.013333h-179.2a17.066667 17.066667 0 0 0-17.066666 17.066666v179.2a17.066667 17.066667 0 0 0 29.013333 10.24z"
                    p-id="4743" fill="#4347b2"></path>
            </svg>
        </button>
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
import anime from "animejs";
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
            class: 'flex justify-center cursor-pointer text-gray-800 hover:text-gray-400 transition-colors'
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

//旋转卡片
const handleRotate = () => {
    anime({
            targets: ".rotated-card",
            rotateY: "+= 180",
            duration: 500
        })
}
</script>

<style scoped></style>