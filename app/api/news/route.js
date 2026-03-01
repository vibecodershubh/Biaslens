import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "general";
    const category = searchParams.get("category") || "";

    try {
        const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY || process.env.NEWS_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "Missing News API Key" }, { status: 500 });
        }

        let url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${apiKey}&language=en&sortBy=publishedAt&pageSize=12`;

    if (category) {
      // NewsAPI uses top-headlines for categories
      url = `https://newsapi.org/v2/top-headlines?category=${encodeURIComponent(category)}&country=us&apiKey=${apiKey}&pageSize=12`;
      if (query && query !== "general") {
         url += `&q=${encodeURIComponent(query)}`;
      }
    }

    const response = await axios.get(url);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("News API Error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "Failed to fetch news data" },
      { status: error.response?.status || 500 }
    );
  }
}
