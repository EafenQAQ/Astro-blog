import axios from "axios";

// Base URLs for different environments
const PRODUCTION_URL = "/.netlify/functions/notion-api";
const NETLIFY_DEV_URL = "http://localhost:8888/.netlify/functions/notion-api";

// Determine the appropriate base URL based on environment
const getBaseUrl = () => {
  if (import.meta.env.DEV) {
    // Local development with Netlify CLI
    return NETLIFY_DEV_URL;
  } else {
    // Production/deployed environment
    return PRODUCTION_URL;
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
    } else {
      path = endpoint;
    }

    const url = `${baseUrl}${path}`;
    console.log(`Fetching articles from: ${url}`);

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw error;
  }
};

export default fetchArticles;
