<template>


    <div class="my-10 max-w-[90rem] min-h-screen w-full">

        <div class="flex gap-2 text-3xl font-bold my-5 ml-5">
            <span>
                <svg t="1743222624926" class="icon" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="2709" width="32" height="32">
                    <path
                        d="M858.528537 988.072043C858.528537 990.471701 858.238844 992.802927 857.706981 995.039871 856.758447 1010.772228 843.705175 1023.239652 827.734449 1023.239652L195.505204 1023.239652C178.918215 1023.239652 165.471463 1009.7929 165.471463 993.205912 165.471463 992.340256 165.516324 991.485625 165.588177 990.638977 165.516324 989.79195 165.471463 988.937319 165.471463 988.072043L165.471463 155.491137 165.471463 155.491137 165.471463 125.457397C165.471463 108.870028 178.917835 95.423656 195.505204 95.423656L384.831821 95.423656 384.831821 155.491137 225.538944 155.491137 225.538944 963.172171 798.461056 963.172171 798.461056 155.110963 639.168179 155.110963 639.168179 95.043482 828.494796 95.043482C845.081785 95.043482 858.528537 108.489854 858.528537 125.077223L858.528537 125.455116C858.528537 125.455876 858.528537 125.456636 858.528537 125.457397L858.528537 988.072043ZM648.944352 549.349427 694.292259 596.282659 452.068241 822.696003 330.084113 696.442903 377.585705 651.639785 454.221546 730.959654 648.944352 549.349427ZM698.095139 190.086965C716.992064 190.086965 732.310792 205.405693 732.310792 224.302618L732.310792 282.849404 289.02799 282.849404 289.02799 224.302618C289.02799 205.405693 304.346719 190.086965 323.243644 190.086965L416.714727 190.086965C416.505251 189.550159 416.386257 188.968113 416.386257 188.357173L416.386257 96.184004C416.386257 43.483154 459.108682 0.760348 511.809913 0.760348 564.510764 0.760348 607.233569 43.483154 607.233569 96.184004L607.233569 188.357173C607.233569 188.968113 607.114575 189.550159 606.905099 190.086965L698.095139 190.086965ZM511.809913 93.522787C493.123224 93.522787 477.974433 108.671577 477.974433 127.358266 477.974433 146.044956 493.123224 161.193746 511.809913 161.193746 530.496602 161.193746 545.645393 146.044956 545.645393 127.358266 545.645393 108.671577 530.496602 93.522787 511.809913 93.522787Z"
                        p-id="2710" fill="#515151"></path>
                </svg>
            </span>
            文章列表
        </div>

        <div v-if="loading" class=" flex justify-center items-center h-screen">
            <span class="loading loading-dots loading-xl"></span>
        </div>

        <template v-else>
            <ul class="grid grid-cols-2 grid-rows-3 gap-6 2xl:grid-cols-3  justify-items-center max-sm:grid-cols-1">
                <li v-for="article in articles" :key="article.id" class="flex flex-col w-[80%] justify-between my-4 bg-gray-200/30 hover:bg-gray-300/30  
                  lg:size-110 lg:max-h-[25rem]  transition-all duration-100 ease-in-out backdrop-blur-sm 
                  rounded-2xl p-5">
                    <a :href="`/articles/${article.id}`" class="hover:cursor-pointer">
                        <img class="thumbnails w-[95%] h-45 m-4 mx-auto rounded-md max-sm:w-[90%]"
                            :src="article.properties['Image URL'].url" alt="封面图" />
                        <div class="flex flex-col gap-2">
                            <h2 class="text-xl max-sm:text-xl font-semibold max-sm:pb-5">{{
                                article.properties.title.title[0].plain_text }}</h2>
                            <p class=" text-sm text-base-content/80">
                                {{ article.properties.content.rich_text[0].plain_text.slice(0, 40) + '...' }}
                            </p>
                        </div>
                    </a>
                    <div class="flex gap-2 self-end mt-6">
                        <div class="flex gap-1 items-center text-sm text-base-content/80">
                            <span>
                                <svg t="1743309980325" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                    xmlns="http://www.w3.org/2000/svg" p-id="1827" width="16" height="16">
                                    <path
                                        d="M833 128c0-53-43-96-96-96h-16c-53 0-96 43-96 96H400c0-53-43-96-96-96h-16c-53 0-96 43-96 96H64c-35.3 0-64 28.7-64 64v736c0 35.3 28.7 64 64 64h896c35.3 0 64-28.7 64-64V192c0-35.3-28.7-64-64-64H833zM729 96c22.1 0 40 17.9 40 40v80c0 22.1-17.9 40-40 40s-40-17.9-40-40v-80c0-22.1 17.9-40 40-40z m-433 0c22.1 0 40 17.9 40 40v80c0 22.1-17.9 40-40 40s-40-17.9-40-40v-80c0-22.1 17.9-40 40-40z m632 832H96c-17.7 0-32-14.3-32-32V448h896v448c0 17.7-14.3 32-32 32z m32-544H64V224c0-17.7 14.3-32 32-32h96v32c0 53 43 96 96 96h16c53 0 96-43 96-96v-32h225v24c0 57.4 46.6 104 104 104s104-46.6 104-104v-24h95c17.7 0 32 14.3 32 32v160z"
                                        p-id="1828" fill="#707070"></path>
                                </svg>
                            </span>
                            {{ article.created_time.toString().slice(0, 10) }}
                        </div>
                        <!-- <div class="flex gap-1 text-sm text-base-content/80">
                            <span>
                                <svg t="1743310063395" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                    xmlns="http://www.w3.org/2000/svg" p-id="3030" width="16" height="16">
                                    <path
                                        d="M867.46946 946.154914h-539.964494c-21.1699 0-38.228037 17.058137-38.228037 38.234178 0 21.175018 17.058137 38.234178 38.228037 38.234179h539.964494c21.175018 0 38.228037-17.058137 38.228037-38.234179 0-21.175018-17.053019-38.234178-38.228037-38.234178z m0 0M801.001583 373.848029c78.229956-135.871411 91.171212-325.268421 91.759776-332.91976 1.172011-14.113267-6.473187-28.231651-18.824854-35.288285-12.352691-7.056633-27.643087-7.056633-39.995777 0.588565-28.231651 18.230148-277.03888 179.395506-330.563455 270.56467-78.228932 131.75453-270.569788 483.493003-272.332411 487.021319-1.766717 2.94487-2.355282 5.884622-3.528317 8.824374L122.228996 954.978265c-10.58495 18.237313-4.116881 41.762495 14.118385 52.347445 5.879504 3.534458 12.351667 5.296058 18.818713 5.296057 12.941255 0 25.882511-7.056633 32.939144-19.409324l107.63976-185.867669c67.054394-45.879376 426.440112-296.448205 505.256585-433.496745z m-231.746021-58.820632C595.719472 269.736585 709.832419 182.684302 806.292523 116.216425c-10.58495 62.348948-31.759968 149.991843-71.167181 219.397425-45.879376 78.817497-219.395378 218.218249-356.443919 319.38994C441.029348 541.479408 523.96475 391.49473 569.255562 315.027397z m0 0"
                                        fill="#999999" p-id="3031"></path>
                                </svg>
                            </span>
                            {{ 作者 }}
                        </div> -->
                    </div>
                </li>
            </ul>
        </template>
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
        const data = await fetchArticles('/notion-articles')
        articles.value = data;
        articles.value.slice(0, 4)
    } catch (err) {
        console.error("在RSSPassageListPre组件中获取文章信息出错", err);
        error.value = err;

    } finally {
        loading.value = false
    }

}
)
</script>

<style scoped>
.thumbnails {
    object-fit: cover;
}

.backdrop-blur-sm {
    z-index: 10;
}
</style>
