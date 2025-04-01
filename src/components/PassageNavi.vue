<template>
    <div class="flex flex-col max-sm:fixed max-sm:top-10 max-sm:right-0 max-sm:bg-white/80  items-center flex-1">
        <div>
            <ShowPassageNavi  @togglePassageNavi="togglePassageNavi" />
        </div>
        <Transition name="PassageNavi">
            <aside v-if="showPassageNavi"
                class="toc w-64 max-w-[20rem] bg-white/30 backdrop-blur-md p-5 rounded-xl shadow-md ml-5 sticky top-10 h-fit">
                <div class="text-lg font-bold mb-4">目录</div>
                <div class="tree-structure text-sm">
                    <template v-for="(heading, index) in processedHeadings" :key="index">
                        <!-- Only render top-level headings directly -->
                        <div v-if="heading.level === 'h1'" class="heading-item">
                            <div class="flex items-center cursor-pointer" @click="toggleHeading(heading.id)">
                                <span v-if="hasChildren(heading.id)" class="toggle-icon mr-1">
                                    {{ isExpanded(heading.id) ? '▼' : '►' }}
                                </span>
                                <span v-else class="mr-4"></span>
                                <a href="javascript:void(0)" @click.stop="scrollToHeading(heading.id)"
                                    class="text-blue-500 hover:underline">
                                    {{ heading.text }}
                                </a>
                            </div>
                            <!-- Render children if expanded -->
                            <div v-if="isExpanded(heading.id)" class="pl-4 mt-1">
                                <template v-for="(child, childIndex) in getChildren(heading.id)"
                                    :key="`${index}-${childIndex}`">
                                    <div class="heading-item">
                                        <div class="flex items-center cursor-pointer" @click="toggleHeading(child.id)">
                                            <span v-if="hasChildren(child.id)" class="toggle-icon mr-1">
                                                {{ isExpanded(child.id) ? '▼' : '►' }}
                                            </span>
                                            <span v-else class="mr-4"></span>
                                            <a href="javascript:void(0)" @click.stop="scrollToHeading(child.id)"
                                                class="text-blue-500 hover:underline">
                                                {{ child.text }}
                                            </a>
                                        </div>
                                        <!-- Render grandchildren if expanded -->
                                        <div v-if="isExpanded(child.id)" class="pl-4 mt-1">
                                            <div v-for="(grandchild, grandchildIndex) in getChildren(child.id)"
                                                :key="`${index}-${childIndex}-${grandchildIndex}`" class="heading-item">
                                                <div class="flex items-center">
                                                    <span class="mr-4"></span>
                                                    <a href="javascript:void(0)"
                                                        @click.stop="scrollToHeading(grandchild.id)"
                                                        class="text-blue-500 hover:underline">
                                                        {{ grandchild.text }}
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </template>
                </div>
            </aside>
        </Transition>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import ShowPassageNavi from './showPassageNavi.vue';




// 响应式变量存储标题数据
const headings = ref([]);
// 存储展开状态的Map
const expandedHeadings = ref(new Map());

// 处理后的标题数据，添加父子关系
const processedHeadings = computed(() => {
    // 首先为所有标题添加父标题的引用
    return headings.value.map((heading, index) => {
        // 默认展开所有h1标题
        if (heading.level === 'h1' && !expandedHeadings.value.has(heading.id)) {
            expandedHeadings.value.set(heading.id, true);
        }
        return heading;
    });
});

// 判断标题是否有子标题
const hasChildren = (headingId) => {
    const headingIndex = headings.value.findIndex(h => h.id === headingId);
    if (headingIndex === -1 || headingIndex >= headings.value.length - 1) return false;

    const currentHeading = headings.value[headingIndex];
    const nextHeading = headings.value[headingIndex + 1];

    // 检查标题等级关系判断是否有子标题
    if (currentHeading.level === 'h1' && ['h2', 'h3'].includes(nextHeading.level)) return true;
    if (currentHeading.level === 'h2' && nextHeading.level === 'h3') return true;

    return false;
};

// 获取标题的子标题
const getChildren = (headingId) => {
    const headingIndex = headings.value.findIndex(h => h.id === headingId);
    if (headingIndex === -1) return [];

    const currentHeading = headings.value[headingIndex];
    const children = [];

    // 从当前标题之后开始查找
    for (let i = headingIndex + 1; i < headings.value.length; i++) {
        const heading = headings.value[i];

        // 如果遇到相同或更高级别的标题，结束搜索
        if (getHeadingLevel(heading.level) <= getHeadingLevel(currentHeading.level)) {
            break;
        }

        // 如果是直接子标题，添加到结果中
        if (
            (currentHeading.level === 'h1' && heading.level === 'h2') ||
            (currentHeading.level === 'h2' && heading.level === 'h3')
        ) {
            children.push(heading);
        }
    }

    return children;
};

// 将标题级别转换为数字以便比较
const getHeadingLevel = (level) => {
    return parseInt(level.replace('h', ''));
};

// 检查标题是否展开
const isExpanded = (headingId) => {
    return expandedHeadings.value.get(headingId) === true;
};

// 切换标题展开/折叠状态
const toggleHeading = (headingId) => {
    expandedHeadings.value.set(
        headingId,
        !expandedHeadings.value.get(headingId)
    );
};

// 提取页面中的标题
onMounted(() => {
    const extractedHeadings = Array.from(document.querySelectorAll('h1, h2, h3')).map((heading) => {
        // 为标题生成唯一ID
        const id = heading.id || heading.textContent.trim().toLowerCase().replace(/\s+/g, '-');

        // 如果标题没有ID，添加一个
        if (!heading.id) {
            heading.id = id;
        }

        return {
            id: id,
            text: heading.textContent,
            level: heading.tagName.toLowerCase(),
        };
    });

    headings.value = extractedHeadings;

    // 默认展开所有h1标题
    extractedHeadings.forEach(heading => {
        if (heading.level === 'h1') {
            expandedHeadings.value.set(heading.id, true);
        }
    });
});

// 平滑滚动到指定标题
const scrollToHeading = (id) => {
    const target = document.getElementById(id);
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth', // 启用平滑滚动
            block: 'start',     // 滚动到元素顶部
        });
    }
};

// 显示或隐藏目录

const showPassageNavi = ref(false)
const togglePassageNavi = () => {
    showPassageNavi.value = !showPassageNavi.value
    
}


</script>

<style scoped>
.toc {
    max-height: calc(100vh - 20px);
    overflow-y: auto;
}

.heading-item {
    margin-bottom: 0.5rem;
}

.toggle-icon {
    font-size: 0.75rem;
    display: inline-block;
    width: 12px;
    text-align: center;
    transition: transform 0.2s;
}

a {
    color: #252525;
}

.PassageNavi-enter-active,
.PassageNavi-leave-active {
    transition: opacity 0.5s ease;
}

.PassageNavi-enter-from,
.PassageNavi-leave-to {
    opacity: 0;
}
</style>