"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Activity, Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import HeroBackground from "@/components/hero_components/HeroBackground";

export default function Home() {
 const [textToAnalyze, setTextToAnalyze] = useState("");
 const router = useRouter();

 const handleStartAnalysis = () => {
 if (textToAnalyze.trim()) {
 sessionStorage.setItem("biaslens_text_to_analyze", textToAnalyze);
 }
 router.push("/analyze");
 };

 const containerVariants = {
 hidden: { opacity: 0 },
 visible: {
 opacity: 1,
 transition: { staggerChildren: 0.1, delayChildren: 0.2 },
 },
 };

 const itemVariants = {
 hidden: { y: 20, opacity: 0 },
 visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
 };

 return (
 <main className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center justify-center relative">
 <HeroBackground />
 <motion.div
 variants={containerVariants}
 initial="hidden"
 animate="visible"
 className="w-full max-w-4xl text-center flex flex-col items-center gap-8"
 >
 <motion.div
 variants={itemVariants}
 className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-theme-accent/30 bg-theme-accent/10 transition-colors duration-300"
 >
 <Activity className="w-4 h-4 text-theme-accent " />
 <span className="text-[10px] font-black tracking-[0.2em] text-theme-accent uppercase transition-colors duration-300">
 Next-Gen Media Analysis
 </span>
 </motion.div>

 <motion.h1
 variants={itemVariants}
 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.1] text-theme-heading transition-colors duration-300"
 >
 UNMASK THE{" "}
 <span className="text-transparent bg-clip-text bg-gradient-to-r from-theme-accent to-theme-heading heading-glow inline-block transition-colors duration-300">
 BIAS
 </span>
 <br />
 <span className="text-transparent bg-clip-text bg-gradient-to-r from-theme-heading to-theme-text transition-colors duration-300 pb-2">
 IN EVERY STORY.
 </span>
 </motion.h1>

 <motion.p
 variants={itemVariants}
 className="text-lg sm:text-xl text-theme-text max-w-2xl font-light leading-relaxed transition-colors duration-300"
 >
 An AI-powered cognitive analysis engine designed to detect emotional manipulation, political tilt, and framing bias in real-time.
 </motion.p>

 <motion.div variants={itemVariants} className="w-full max-w-2xl mt-8">
 <div className="relative group">
 <div className="absolute inset-0 bg-theme-accent/5 rounded-3xl blur-xl group-hover:bg-theme-accent/10 transition-all duration-300"></div>
 <div className="relative bg-theme-card-bg/80 backdrop-blur-xl border-2 border-theme-card-border rounded-3xl p-2 md:p-4 flex flex-col items-end gap-3 transition-colors focus-within:border-theme-accent shadow-sm ">
 <textarea
 value={textToAnalyze}
 onChange={(e) => setTextToAnalyze(e.target.value)}
 placeholder="Paste news text or URL for analysis..."
 className="w-full bg-transparent border-none outline-none resize-none h-32 p-4 text-theme-text placeholder:text-theme-text/50 dark:placeholder:text-zinc-600 focus:ring-0 transition-colors duration-300"
 />
 <div className="flex w-full justify-between items-center px-4 pb-2">
 <span className="text-xs font-mono text-theme-accent animate-pulse transition-colors duration-300">
 RESULT: AWAITING DATA STREAM...
 </span>
 <button
 onClick={handleStartAnalysis}
 className="bg-theme-accent hover:bg-theme-accent-hover text-theme-accent-text px-6 py-2 rounded-xl text-sm font-semibold tracking-wide shadow-xl shadow-theme-accent/20 active:scale-95 transition-all flex items-center gap-2"
 >
 <Search className="w-4 h-4" />
 START ANALYSIS
 </button>
 </div>
 </div>
 </div>
 </motion.div>

 <motion.div variants={itemVariants} className="flex gap-6 mt-8">
 <Link
 href="/news"
 className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-theme-accent px-8 py-3 text-sm font-semibold text-theme-accent-text transition-all hover:bg-theme-accent-hover "
 >
 <span>EXPLORE NEWS</span>
 <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
 </Link>
 </motion.div>
 </motion.div>
 </main>
 );
}
