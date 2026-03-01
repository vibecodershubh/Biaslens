"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchBar({ initialQuery, initialCategory }) {
 const [query, setQuery] = useState(initialQuery);
 const router = useRouter();

 useEffect(() => {
 // Debounce logic
 const handler = setTimeout(() => {
 if (query !== initialQuery) {
 if (query) {
 router.push(`/news?q=${encodeURIComponent(query)}&category=${initialCategory}`);
 } else {
 router.push(`/news?category=${initialCategory}`);
 }
 }
 }, 500);

 return () => clearTimeout(handler);
 }, [query, initialCategory, router, initialQuery]);

 return (
 <div className="relative group w-full">
 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
 <Search className="h-4 w-4 text-zinc-500 group-focus-within:text-indigo-400" />
 </div>
 <input
 type="text"
 className="block w-full pl-10 pr-3 py-2 border-2 border-white/10 rounded-xl leading-5 bg-zinc-900/50 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm transition-all shadow-inner"
 placeholder="Search keywords or topics..."
 value={query}
 onChange={(e) => setQuery(e.target.value)}
 />
 </div>
 );
}
