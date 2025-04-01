import axios from "axios";
// 从Notion数据库获取文章
const fetchArticles = async (url) => {

  try {
    const res = await axios.get(url);
    const articles = res.data;
    return articles;
  } catch (err) {
    console.log(err);
  }
};

export default fetchArticles;
