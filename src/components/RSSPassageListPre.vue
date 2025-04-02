<template>
    <div id="RSSPassageListPre" class="my-10 max-w-[90rem] w-full overflow-y-auto">

        <ul>
            <div class="flex gap-2 text-3xl font-bold my-5 ml-5">
                <span>
                    <svg t="1743537922894" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="13148" width="32" height="32">
                        <path
                            d="M245.324385 913.116229a110.883771 110.883771 0 1 1-110.883771-110.883771A110.883771 110.883771 0 0 1 245.324385 913.116229zM155.901989 1.00779A118.484675 118.484675 0 0 0 61.114249 30.517181 115.802003 115.802003 0 0 0 21.768395 117.256905a117.590451 117.590451 0 0 0 104.177092 114.907779c327.733081 41.581414 603.601173 337.569545 641.158578 688.552449a114.460667 114.460667 0 0 0 114.907779 102.835755 118.037563 118.037563 0 0 0 89.422396-38.898742 113.119331 113.119331 0 0 0 28.615167-89.422396C949.525753 440.965978 586.470826 56.449676 155.901989 1.00779z m7.600904 381.833631A110.883771 110.883771 0 0 0 66.479593 403.408572a117.143339 117.143339 0 0 0-44.711198 92.55218 114.460667 114.460667 0 0 0 89.422396 112.225107c134.133594 32.192063 250.382709 163.642985 279.8921 318.790841a116.249115 116.249115 0 0 0 112.225106 93.446404 116.696227 116.696227 0 0 0 89.422396-42.028526 112.672219 112.672219 0 0 0 24.591159-93.446404C571.71613 643.060593 383.929099 436.494859 161.267333 383.735645z"
                            fill="#3E2AD1" p-id="13149"></path>
                    </svg>
                </span>
                AI & 技术新进展
            </div>

            <div class="flex justify-center w-full" v-if="loading">
                <span class="loading loading-dots loading-md"></span>
            </div>

            <template v-else>
                <li class="my-4 w-full ">
                    <a :href="`/articles/${article.id}`" v-for="article in articles" :key="article.id"
                        class=" max-sm:flex-col max-sm:items-center max-sm:gap-0 mx-5 px-2 gap-2 rounded-2xl shadow-md hover:bg-gray-100/50 transition duration-150 flex">
                        <img class=" w-40 m-4 rounded-md max-sm:w-[80%]" :src="article.properties['Image URL'].url" />
                        <div class="flex flex-col flex-1  
                          max-sm:w-[90%] max-sm:items-center
                          max-sm:px-5 max-sm:pb-5 gap-1 items-start justify-center">
                            <h2 class="text-xl font-semibold max-sm:pb-2">{{
                                article.properties.Name.title[0].plain_text }}</h2>
                            <p class=" text-sm text-base-content/80">
                                {{ article.properties.content.rich_text[0].plain_text.slice(0, 100) + '...' }}
                            </p>
                        </div>
                    </a>
                </li>
            </template>

        </ul>
        <!-- Read more -->
        <div class="flex flex-1 justify-end">
            <a href="/articles"
                class="flex items-center gap-1 px-4 py-2 hover:cursor-pointer self-end bg-white/0 border-none hover:backdrop-blur-sm rounded-3xl hover:bg-gray-300/30">Read
                More
                <span>
                    <svg t="1743312005051" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="3440" width="16" height="16">
                        <path
                            d="M514 912c-219.9 0-398.8-178.9-398.8-398.9 0-219.9 178.9-398.8 398.8-398.8s398.8 178.9 398.8 398.8c0 220-178.9 398.9-398.8 398.9z m0-701.5c-166.9 0-302.7 135.8-302.7 302.7S347.1 815.9 514 815.9s302.7-135.8 302.7-302.7S680.9 210.5 514 210.5z"
                            fill="#13227a" p-id="3441"></path>
                        <path
                            d="M402.5 677.3c0-15 5.7-30.1 17.2-41.5l122.6-122.6-122.6-122.6c-22.9-22.9-22.9-60.2 0-83.1 22.9-22.9 60.2-22.9 83.1 0l164.1 164.1c22.9 22.9 22.9 60.2 0 83.1L502.8 718.8c-22.9 22.9-60.2 22.9-83.1 0-11.5-11.4-17.2-26.5-17.2-41.5z"
                            fill="#13227a" p-id="3442"></path>
                    </svg>
                </span>
            </a>

        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import fetchArticles from '../utilities/FetchNotion';

const articles = ref([]);
const loading = ref(true);
const error = ref(null);
onMounted(async () => {
    try {
        const data = await fetchArticles('/notion-articles-pre')
        articles.value = data;
        articles.value.slice(0, 4)
        console.log(articles.value);

    } catch (err) {
        console.error("在RSSPassageListPre组件中获取文章信息出错", err);
        error.value = err;

    } finally {
        loading.value = false
    }

}
)
</script>

<style lang="scss" scoped></style>