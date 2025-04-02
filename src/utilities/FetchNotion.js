import axios from "axios";
// 设定base url

const liveUrl =
  "https://momo-blog-test.netlify.app/.netlify/functions/notion-proxy/api";
const devUrl = "http://localhost:4399/api";

// 从Notion数据库获取文章
const fetchArticles = async (url) => {
  try {
    const res = await axios.get(liveUrl + url);
    const articles = res.data;
    return articles;
  } catch (err) {
    console.log(err);
  }
};

export default fetchArticles;
