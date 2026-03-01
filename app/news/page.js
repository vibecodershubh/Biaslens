"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { format } from "date-fns";
import { ShieldAlert, ImageOff, Flame, Search, ArrowRight, Activity, Filter, Loader2, Bot } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewsPage({ searchParams }) {
 const router = useRouter();
 const [articles, setArticles] = useState([]);
 const [loading, setLoading] = useState(true);
 const [query, setQuery] = useState("");
 const [category, setCategory] = useState("");
 const [page, setPage] = useState(1);

 const categories = ["Technology", "Business", "Politics", "Sports", "Entertainment", "Science"];

 const fetchNews = async (q, cat, pageNum = 1) => {
 setLoading(true);
 try {
 const res = await axios.get('/api/news', {
 params: { q: q || "general", category: cat } // the API might not support page natively right now, but we are just sending it.
 });
 setArticles(res.data.articles || []);
 } catch (e) {
 console.error(e);
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 fetchNews(query, category, page);
 }, [query, category, page]);

 const handleAnalyze = (e, article) => {
 e.preventDefault();
 e.stopPropagation();
 const payload = `Title: ${article.title}\nDescription: ${article.description}\nSource: ${article.source.name}\nPublished: ${article.publishedAt}`;
 sessionStorage.setItem("biaslens_text_to_analyze", payload);
 router.push("/analyze");
 };

 return (
 <main className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
 <div>
 <h1 className="text-4xl md:text-5xl font-black font-serif tracking-tight text-theme-heading mb-2 flex items-center gap-4 transition-colors">
 LIVE <span className="text-theme-accent ">FEED</span>
 <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-500/10 px-3 py-1 rounded-full uppercase tracking-widest border border-red-500/20 ">
 <Flame className="w-3 h-3" /> Trending
 </span>
 </h1>
 <p className="text-theme-text font-light transition-colors">
 Real-time intelligence dashboard. Select an article to deploy the cognitive analysis engine.
 </p>
 </div>

 {/* Search Bar */}
 <div className="w-full md:w-96 relative group">
 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
 <Search className="h-4 w-4 text-theme-text/50 group-focus-within:text-theme-accent dark:group-focus-within:text-indigo-400 transition-colors" />
 </div>
 <input
 type="text"
 className="block w-full pl-10 pr-3 py-3 border border-theme-card-border rounded-xl leading-5 bg-theme-card-bg/80 text-theme-text placeholder-theme-text/60 focus:outline-none focus:border-theme-accent dark:focus:border-indigo-500/50 focus:bg-theme-card-bg dark:focus:bg-zinc-900 transition-all shadow-sm "
 placeholder="Search intel databases..."
 value={query}
 onChange={(e) => setQuery(e.target.value)}
 />
 </div>
 </div>

 {/* Categories */}
 <div className="flex items-center gap-3 overflow-x-auto pb-6 scrollbar-hide mb-6 border-b border-theme-card-border transition-colors">
 <button
 onClick={() => setCategory("")}
 className={`px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase whitespace-nowrap transition-all border ${category === "" ? "bg-theme-accent text-theme-accent-text border-theme-accent shadow-md " : "bg-transparent text-theme-text border-theme-card-border hover:border-theme-accent hover:text-theme-heading "}`}
 >
 <Activity className="w-3 h-3 inline mr-2" /> Top Stories
 </button>
 {categories.map(cat => (
 <button
 key={cat}
 onClick={() => setCategory(cat.toLowerCase())}
 className={`px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase whitespace-nowrap transition-all border ${category === cat.toLowerCase() ? "bg-theme-accent text-theme-accent-text border-theme-accent shadow-md " : "bg-transparent text-theme-text border-theme-card-border hover:border-theme-accent hover:text-theme-heading "}`}
 >
 {cat}
 </button>
 ))}
 </div>

 {loading ? (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {[1, 2, 3, 4, 5, 6].map(i => (
 <div key={i} className="bg-theme-card-bg/40 border border-theme-card-border rounded-2xl overflow-hidden animate-pulse">
 <div className="aspect-video bg-black/5 w-full" />
 <div className="p-6">
 <div className="h-3 bg-black/5 rounded w-1/4 mb-3" />
 <div className="h-5 bg-black/5 rounded w-full mb-2" />
 <div className="h-5 bg-black/5 rounded w-5/6 mb-4" />
 <div className="h-3 bg-black/5 rounded w-full mb-2" />
 <div className="h-3 bg-black/5 rounded w-2/3" />
 </div>
 </div>
 ))}
 </div>
 ) : articles.length === 0 ? (
 <div className="flex flex-col items-center justify-center py-20 bg-theme-card-bg/50 border border-theme-card-border rounded-3xl backdrop-blur-sm transition-colors">
 <ShieldAlert className="w-12 h-12 text-theme-heading/50 mb-4" />
 <h2 className="text-xl font-bold font-serif text-theme-heading ">No signals detected</h2>
 <p className="text-theme-text/80 text-sm mt-2">Adjust your feed parameters to find stories.</p>
 </div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {articles.map((article, idx) => (
 <div
 key={idx + article.title}
 className="group flex flex-col bg-theme-card-bg/60 border border-theme-card-border hover:border-theme-accent rounded-[2rem] overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl xl cursor-pointer"
 onClick={() => window.open(article.url, '_blank')}
 >
 <div className="aspect-video w-full bg-black/5 relative overflow-hidden">
 {article.urlToImage ? (
 <img
 src={article.urlToImage}
 alt={article.title}
 className="object-cover w-full h-full opacity-90 dark:opacity-80 group-hover:opacity-100 transition-opacity scale-100 group-hover:scale-105 duration-300"
 />
 ) : (
 <div className="flex items-center justify-center w-full h-full opacity-30 text-theme-text bg-theme-card-bg ">
 <ImageOff className="w-8 h-8" />
 </div>
 )}
 <div className="absolute top-4 left-4">
 <span className="px-3 py-1 bg-black/80 backdrop-blur-xl rounded-full text-[10px] font-bold text-white uppercase tracking-wider shadow-sm border border-white/10">
 {article.source?.name || "Unknown"}
 </span>
 </div>
 </div>
 <div className="p-6 flex flex-col flex-grow relative">
 <span className="text-[11px] text-theme-text/80 mb-3 block font-mono uppercase tracking-widest">
 {article.publishedAt ? format(new Date(article.publishedAt), 'MMM dd, yyyy • HH:mm') : "Recent"}
 </span>
 <h3 className="text-lg font-bold font-serif text-theme-heading mb-3 line-clamp-3 group-hover:text-theme-accent transition-colors leading-tight">
 {article.title}
 </h3>
 <p className="text-sm text-theme-text line-clamp-3 mt-auto font-sans leading-relaxed">
 {article.description}
 </p>

 <div className="mt-6 pt-6 border-t border-theme-card-border flex gap-2 w-full z-10 transition-colors">
 <button
 onClick={(e) => handleAnalyze(e, article)}
 className="flex-1 bg-theme-accent/10 hover:bg-theme-accent text-theme-accent hover:text-theme-accent-text px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all text-center flex items-center justify-center gap-2 border border-theme-accent/20 hover:border-theme-accent shadow-sm "
 >
 <Bot className="w-4 h-4" /> Analyze AI
 </button>
 </div>
 </div>
 </div>
 ))}
 </div>
 )}
 </main>
 );
}
