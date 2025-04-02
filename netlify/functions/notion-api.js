// netlify/functions/notion-api.js
const { Client } = require("@notionhq/client");

// Initialize Notion client
const getNotionClient = () => {
  const apiKey = process.env.NOTION_API_KEY;
  if (!apiKey) {
    throw new Error("Missing Notion API Key");
  }
  return new Client({ auth: apiKey });
};

// Handler for Netlify Functions
exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  // Only allow GET requests
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const notion = getNotionClient();
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!databaseId) {
      throw new Error("Missing Notion Database ID");
    }

    // Parse the path to determine what endpoint was requested
    const path = event.path.split("/").pop();
    let pageSize = 9; // Default

    // Adjust page size based on endpoint
    if (path === "articles-preview") {
      pageSize = 3;
    }

    // Query the Notion database
    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: "Created time",
          direction: "descending",
        },
      ],
      page_size: pageSize,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response.results),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Failed to fetch data from Notion",
        message: error.message,
      }),
    };
  }
};
