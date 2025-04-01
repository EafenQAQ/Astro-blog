import axios from "axios";
// 从Notion数据库获取文章
const fetchArticles = async () => {
  try {
    const res = await axios.get("http://localhost:4399/api/notion-articles");
    const articles = res.data;
    return articles;
  } catch (err) {
    console.log(err);
  }
};

export default fetchArticles;
