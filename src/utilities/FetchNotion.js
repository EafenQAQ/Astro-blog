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



export default fetchArticles;
