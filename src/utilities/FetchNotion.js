import axios from "axios";

// 给不同环境配置不同的url
const PRODUCTION_URL = "/.netlify/functions/notion-api";
const DEV_URL = "http://localhost:4399/api";

// 根据当前环境来选择URL
const getBaseUrl = () => {
  if (import.meta.env.DEV) {
    return DEV_URL;
  } else {
    return PRODUCTION_URL;
  }
};

const fetchArticles = async (endpoint) => {
  try {
    const baseUrl = getBaseUrl();

    const url = `${baseUrl}${endpoint}`;
    console.log(`Fetching from: ${url}`);

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// Function to fetch articles from Notion database via our Netlify Function
const fetchArticles = async (endpoint) => {
  try {
    const baseUrl = getBaseUrl();
    let path;

    // Map the endpoint to the appropriate path
    if (endpoint === "/notion-articles") {
      path = "/articles";
    } else if (endpoint === "/notion-articles-pre") {
      path = "/articles-preview";
    } else if (endpoint.startsWith("/article/")) {
      // 处理获取单篇文章的请求
      path = endpoint;
    } else {
      path = endpoint;
    }

    const url = `${baseUrl}${path}`;
    console.log(`Fetching from: ${url}`);

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// 添加获取单篇文章的函数
export const fetchArticle = async (id) => {
  return fetchArticles(`/article/${id}`);
};

export default fetchArticles;
