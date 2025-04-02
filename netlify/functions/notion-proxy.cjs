// netlify/functions/notion-proxy.cjs
require("dotenv").config();
const express = require("express");
const { Client } = require("@notionhq/client");
const cors = require("cors");

const app = express();
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

app.use(cors());

app.get("/api/notion-articles", async (req, res) => {
  try {
    console.log(
      "环境变量是",
      process.env.NOTION_API_KEY,
      "和",
      process.env.NOTION_DATABASE_ID
    );
    if (!notion || !databaseId) {
      return res
        .status(500)
        .json({ error: "Notion API key or Database ID not configured." });
    }

    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: "Created time",
          direction: "descending",
        },
      ],
      page_size: 9,
    });

    res.json(response.results);
  } catch (error) {
    console.error("Error querying Notion database:", error);
    res.status(500).json({ error: "Failed to fetch data from Notion" });
  }
});

app.get("/api/notion-articles-pre", async (req, res) => {
  try {
    if (!notion || !databaseId) {
      return res
        .status(500)
        .json({ error: "Notion API key or Database ID not configured." });
    }

    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: "Created time",
          direction: "descending",
        },
      ],
      page_size: 3,
    });

    res.json(response.results);
  } catch (error) {
    console.error("Error querying Notion database:", error);
    res.status(500).json({ error: "Failed to fetch data from Notion" });
  }
});

exports.handler = async (event, context) => {
  if (!event.path.startsWith("/.netlify/functions/notion-proxy/api")) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Not Found" }),
    };
  }

  const mockReq = {
    method: event.httpMethod,
    url: event.path,
    query: event.queryStringParameters || {},
  };

  const responseData = await new Promise((resolve, reject) => {
    const mockRes = {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      send: (body) => {
        resolve({
          statusCode: mockRes.statusCode,
          headers: mockRes.headers,
          body: body,
        });
      },
      status: (code) => {
        mockRes.statusCode = code;
        return mockRes;
      },
      json: (data) => {
        mockRes.send(JSON.stringify(data));
      },
      setHeader: (name, value) => {
        mockRes.headers[name] = value;
      },
      getHeader: (name) => {
        return mockRes.headers[name];
      },
      end: () => {
        // 可以根据需要添加 end 方法的实现
      },
    };

    app(mockReq, mockRes, (err) => {
      if (err) {
        reject(err);
      }
    });
  });

  return responseData;
};
