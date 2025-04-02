// netlify/functions/notion-proxy.js
require('dotenv').config();
const express = require('express');
const { Client } = require('@notionhq/client');
const cors = require('cors');

const app = express();
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

app.use(cors());

app.get('/api/notion-articles', async (req, res) => {
  try {
    if (!notion || !databaseId) {
      return res
        .status(500)
        .json({ error: 'Notion API key or Database ID not configured.' });
    }

    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: 'Created time',
          direction: 'descending',
        },
      ],
      page_size: 9,
    });

    res.json(response.results);
  } catch (error) {
    console.error('Error querying Notion database:', error);
    res.status(500).json({ error: 'Failed to fetch data from Notion' });
  }
});

app.get('/api/notion-articles-pre', async (req, res) => {
  try {
    if (!notion || !databaseId) {
      return res
        .status(500)
        .json({ error: 'Notion API key or Database ID not configured.' });
    }

    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: 'Created time',
          direction: 'descending',
        },
      ],
      page_size: 3,
    });

    res.json(response.results);
  } catch (error) {
    console.error('Error querying Notion database:', error);
    res.status(500).json({ error: 'Failed to fetch data from Notion' });
  }
});

// Netlify Function 的处理函数
exports.handler = async (event, context) => {
  // 确保请求路径以 /api 开头，否则返回 404
  if (!event.path.startsWith('/api')) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Not Found啊啊' }),
    };
  }

  // 创建一个模拟的请求和响应对象
  const mockReq = {
    path: event.path,
    query: event.queryStringParameters || {},
  };
  const mockRes = {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: null,
    status: (code) => {
      mockRes.statusCode = code;
      return mockRes;
    },
    json: (data) => {
      mockRes.body = JSON.stringify(data);
      return mockRes;
    },
  };

  // 使用你的 Express app 处理请求
  await new Promise((resolve) => {
    app(mockReq, mockRes, () => {
      resolve();
    });
  });

  return {
    statusCode: mockRes.statusCode,
    headers: mockRes.headers,
    body: mockRes.body,
  };
};