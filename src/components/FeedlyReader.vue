<template>
    <div id="RSScontent">
        <div class=" bg-blue-200/30 p-10 backdrop-blur-sm  mx-auto w-full max-w-[60rem] h-fit min-h-screen rounded-2xl">
            <div v-for="article in articles" :key="article.id">
                <h1>{{  }}</h1>
            </div>

        </div>

        <button @click="forTest"
            class="bg-red-400 py-2 px-4 rounded-2xl hover:cursor-pointer hover:bg-red-500 text-white">for test</button>
    </div>
</template>

<script setup>
import axios from 'axios';
import xml2js from 'xml2js';
import { ref } from 'vue';

const articles = ref([]);

// 从Notion数据库获取文章
const fetchArticles = async () => {
    try {
        const res = await axios.get("http://localhost:4399/api/notion-articles");
        articles.value = await res.data
        console.log("获取结果是", articles.value);
    } catch (err) {
        console.log(err);
    }
};


const forTest = () => {
    fetchArticles();
}

</script>


<style scoped>
h1 {
    font-size: 2rem;
    font-weight: 600;
    text-align: center;
    padding: 1rem;
    color: #404040;
}

h2 {
    font-size: 1.5rem;
    font-weight: 600;
    text-align: start;
    padding: 1rem;
    color: #404040;
}

h3 {
    font-size: 1.2rem;
    font-weight: 600;
    text-align: start;
    padding: 0.5rem;
    color: #404040;
}

p {
    color: #606060;
    font-size: 17px;
}
</style>