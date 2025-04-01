require("dotenv").config();
const express = require("express");
const { Client } = require("@notionhq/client");
const cors = require("cors"); // 建议使用，处理跨域请求

const app = express();
const port = process.env.PORT || 4399;

const ApiKey = process.env.NOTION_API_KEY;
const databaseId = process.env.NOTION_DATABASE_ID; // 建议将数据库 ID 放在环境变量中

// 初始化 Notion 客户端
const notion = new Client({ auth: ApiKey });

// 建议使用 CORS 中间件，允许你的前端 Vue 应用访问这个 API
app.use(cors());

// 定义接口：通过 GET /api/notion-articles 代理请求 Notion 数据库数据
app.get("/api/notion-articles", async (req, res) => {
  try {
    if (!notion || !databaseId) {
      return res
        .status(500)
        .json({ error: "Notion API key or Database ID not configured." });
    }

    const response = await notion.databases.query({
      database_id: databaseId,
      // filter: {
      //   or: [
      //     {
      //       property: "文章标题",
      //       title: {
      //         contains: "情绪",
      //       },
      //     },
      //   ],
      // },
      sorts: [
        {
          property: "创建时间",
          direction: "descending",
        },
      ],
      page_size: 3,
    });

    res.json(response.results); // 返回 Notion API 查询结果中的数据数组
  } catch (error) {
    console.error("Error querying Notion database:", error);
    res.status(500).json({ error: "Failed to fetch data from Notion" });
  }
});

// 启动服务器，并监听指定端口
app.listen(port, () => {
  console.log(`Notion API proxy server is running on port ${port}`);
});
