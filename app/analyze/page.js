"use client";
import { useState, useEffect } from "react";
import { ArrowLeft, Loader2, Gauge, AlertTriangle, ShieldCheck, Hash, TrendingUp, CheckCircle, Info, ActivitySquare } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function AnalyzePage() {
 const [text, setText] = useState("");
 const [analysis, setAnalysis] = useState(null);
 const [error, setError] = useState(null);
 const [isLoading, setIsLoading] = useState(false);

 useEffect(() => {
 const storedText = sessionStorage.getItem("biaslens_text_to_analyze");
 if (storedText) {
 setText(storedText);
 handleAnalyze(storedText);
 sessionStorage.removeItem("biaslens_text_to_analyze");
 }
 }, []);

 const handleAnalyze = async (textToProcess) => {
 if (!textToProcess.trim()) return;

 setIsLoading(true);
 setAnalysis(null);
 setError(null);

 try {
 const response = await fetch("/api/analyze", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ text: textToProcess }),
 });

 if (!response.ok) {
 throw new Error("Failed to analyze the text.");
 }

 const data = await response.json();
 setAnalysis(data);
 } catch (err) {
 console.error(err);
 setError("An error occurred while running the cognitive analysis engine. Please try again.");
 } finally {
 setIsLoading(false);
 }
 };

 const getIntensityColor = (score) => {
 if (score > 75) return "text-red-500 bg-red-500/10 border-red-500/30";
 if (score > 40) return "text-yellow-500 bg-yellow-500/10 border-yellow-500/30";
 return "text-green-500 bg-green-500/10 border-green-500/30";
 };

 const getCredibilityColor = (score) => {
 if (score > 80) return "text-green-500";
 if (score > 50) return "text-yellow-500";
 return "text-red-500";
 };

 const getRiskColor = (score) => {
 if (score > 75) return "#ef4444"; // red
 if (score > 40) return "#eab308"; // yellow
 return "#22c55e"; // green
 }

 return (
 <main className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
 <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-semibold mb-8">
 <ArrowLeft className="w-4 h-4" />
 BACK TO START
 </Link>

 <div className="flex flex-col lg:flex-row gap-8">
 {/* Left column: Input space */}
 <div className="w-full lg:w-1/3 flex flex-col gap-6 lg:sticky lg:top-32 lg:self-start">
 <div className="bg-theme-card-bg/80 backdrop-blur-xl border border-theme-card-border p-6 rounded-[2rem] shadow-xl relative">
 <h2 className="text-xl font-bold font-serif text-theme-heading mb-4">Target Text</h2>
 <textarea
 value={text}
 onChange={(e) => setText(e.target.value)}
 disabled={isLoading}
 placeholder="Paste article text here..."
 className="w-full h-[300px] lg:h-[400px] bg-white/50 rounded-xl p-4 text-sm text-theme-text placeholder:text-theme-text/50 dark:placeholder:text-zinc-600 border border-theme-card-border focus:outline-none focus:border-theme-accent dark:focus:border-indigo-500/50 resize-none transition-colors"
 />
 <button
 onClick={() => handleAnalyze(text)}
 disabled={isLoading || !text.trim()}
 className="w-full mt-4 bg-theme-accent hover:bg-theme-accent-hover text-theme-accent-text py-3 rounded-xl text-sm font-semibold tracking-wide shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100"
 >
 {isLoading ? (
 <>
 <Loader2 className="w-4 h-4 animate-spin" /> PROCESSING
 </>
 ) : (
 "INITIALIZE SCAN"
 )}
 </button>
 </div>
 </div>

 {/* Right column: Results */}
 <div className="w-full lg:w-2/3 flex flex-col gap-6">
 {!analysis && !isLoading && !error && (
 <div className="h-full min-h-[500px] bg-theme-card-bg/30 border border-theme-card-border/50 border-dashed rounded-[2rem] flex flex-col items-center justify-center text-theme-text/50 p-12 text-center transition-colors">
 <Gauge className="w-16 h-16 mb-4 opacity-30 text-theme-heading " />
 <h3 className="text-xl font-bold font-serif text-theme-heading mb-2">Awaiting Input Sequence</h3>
 <p className="text-sm max-w-sm text-theme-text ">Provide text payload to initialize the Cognitive Bias Engine and reveal hidden framing patterns.</p>
 </div>
 )}

 {error && (
 <div className="w-full bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-2xl flex items-center gap-4">
 <AlertTriangle className="w-6 h-6 shrink-0" />
 <p>{error}</p>
 </div>
 )}

 {isLoading && (
 <div className="h-full min-h-[500px] bg-zinc-900/50 border border-indigo-500/20 rounded-[2rem] flex flex-col items-center justify-center text-indigo-400 p-12">
 <Loader2 className="w-12 h-12 mb-4 animate-spin" />
 <h3 className="text-lg font-bold tracking-widest uppercase mb-2 animate-pulse">Scanning Vectors</h3>
 <p className="text-sm text-indigo-400/50 font-mono text-center">Running semantic pattern recognition protocols...<br />Analyzing sentiment, entities, and risk parameters.</p>
 </div>
 )}

 {analysis && !isLoading && (
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className="space-y-6"
 >
 {/* Top Cards: Scores */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 <div className="bg-theme-card-bg/80 backdrop-blur-xl border border-theme-card-border p-6 rounded-[2rem] shadow-md flex flex-col items-center justify-center relative overflow-hidden text-center group transition-colors">
 <div className={`absolute inset-0 bg-gradient-to-b ${analysis.biasIntensityScore > 50 ? 'from-red-500/10 to-transparent' : 'from-green-500/10 to-transparent'} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
 <h3 className="text-xs font-bold tracking-widest uppercase text-theme-heading/60 mb-2">Bias Intensity</h3>
 <span className={`text-5xl font-black ${getIntensityColor(analysis.biasIntensityScore).split(' ')[0]}`}>{analysis.biasIntensityScore}</span>
 </div>

 <div className="bg-theme-card-bg/80 backdrop-blur-xl border border-theme-card-border p-6 rounded-[2rem] shadow-md flex flex-col items-center justify-center relative overflow-hidden text-center group transition-colors">
 <div className="absolute inset-0 bg-gradient-to-b from-theme-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
 <h3 className="text-xs font-bold tracking-widest uppercase text-theme-heading/60 mb-2">Credibility</h3>
 <span className={`text-5xl font-black ${getCredibilityColor(analysis.credibilityScore)}`}>{analysis.credibilityScore}%</span>
 </div>

 <div className="bg-theme-card-bg/80 backdrop-blur-xl border border-theme-card-border p-6 rounded-[2rem] shadow-md flex flex-col items-center justify-center relative overflow-hidden text-center group transition-colors">
 <div className="absolute inset-0 bg-gradient-to-b from-sky-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
 <h3 className="text-xs font-bold tracking-widest uppercase text-theme-heading/60 mb-2">Fact-Check Prob.</h3>
 <span className={`text-5xl font-black ${getCredibilityColor(analysis.factCheckProbability)}`}>{analysis.factCheckProbability}%</span>
 </div>
 </div>

 {/* Executive Summary */}
 <div className="bg-theme-card-bg/80 backdrop-blur-xl border border-theme-card-border p-6 md:p-8 rounded-[2rem] shadow-md relative overflow-hidden transition-colors">
 <div className="absolute top-0 right-0 w-64 h-64 bg-theme-accent/5 rounded-full blur-3xl pointer-events-none"></div>

 <div className="mb-8">
 <h2 className="text-sm font-bold tracking-widest text-theme-accent uppercase mb-4 flex items-center gap-2">
 <ActivitySquare className="w-4 h-4" /> AI Summary
 </h2>
 <ul className="space-y-3">
 {analysis.summary.map((point, idx) => (
 <li key={idx} className="flex items-start gap-3 text-lg font-light text-theme-text leading-relaxed">
 <span className="text-theme-accent font-bold mt-1">•</span>
 {point}
 </li>
 ))}
 </ul>
 </div>

 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-theme-card-border ">
 <div className="bg-white/40 p-4 rounded-xl border border-theme-card-border ">
 <span className="block text-[10px] text-theme-text/70 font-bold uppercase tracking-wider mb-1">Political Tilt</span>
 <span className="font-bold text-theme-heading uppercase text-sm">{analysis.politicalTilt}</span>
 </div>
 <div className="bg-white/40 p-4 rounded-xl border border-theme-card-border ">
 <span className="block text-[10px] text-theme-text/70 font-bold uppercase tracking-wider mb-1">Sentiment</span>
 <span className="font-bold text-theme-heading uppercase text-sm">{analysis.sentiment}</span>
 </div>
 <div className="bg-white/40 p-4 rounded-xl border border-theme-card-border col-span-2">
 <span className="block text-[10px] text-theme-text/70 font-bold uppercase tracking-wider mb-2">Entities Found</span>
 <div className="flex flex-wrap gap-2">
 {analysis.entities?.slice(0, 4).map(kw => (
 <span key={kw} className="px-2 py-1 bg-black/5 rounded-md text-[10px] font-bold text-theme-heading ">
 {kw}
 </span>
 ))}
 {analysis.entities?.length > 4 && <span className="text-xs text-theme-text/60 self-center">+{analysis.entities.length - 4}</span>}
 </div>
 </div>
 </div>
 </div>

 {/* Middle Split: Risk Chart & Biases */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {/* Chart */}
 <div className="bg-theme-card-bg/80 backdrop-blur-xl border border-theme-card-border p-6 rounded-[2rem] shadow-md transition-colors">
 <h3 className="text-sm font-bold tracking-widest text-theme-heading/80 uppercase mb-6 flex items-center gap-2">
 <Gauge className="w-4 h-4" />
 Risk Impact Analysis
 </h3>
 <div className="h-64 w-full">
 <ResponsiveContainer width="100%" height="100%">
 <BarChart data={analysis.riskImpact || []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
 <XAxis dataKey="category" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
 <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
 <Tooltip
 cursor={{ fill: 'rgba(0,0,0,0.05)' }}
 contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', borderRadius: '1rem', color: 'var(--text)', fontSize: '12px' }}
 />
 <Bar dataKey="score" radius={[4, 4, 0, 0]}>
 {
 (analysis.riskImpact || []).map((entry, index) => (
 <Cell key={`cell-${index}`} fill={getRiskColor(entry.score)} />
 ))
 }
 </Bar>
 </BarChart>
 </ResponsiveContainer>
 </div>
 <div className="mt-4 space-y-2">
 {(analysis.riskImpact || []).map((r, i) => (
 <div key={i} className="text-xs text-theme-text ">
 <strong className="text-theme-heading ">{r.category}:</strong> {r.explanation}
 </div>
 ))}
 </div>
 </div>

 {/* Detected Biases */}
 <div className="space-y-4">
 <h3 className="text-sm font-bold tracking-widest text-theme-heading/80 uppercase flex items-center gap-2 ml-4">
 <AlertTriangle className="w-4 h-4" />
 Cognitive Anomalies
 </h3>

 {analysis.detectedBiases?.length === 0 ? (
 <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-[2rem] flex items-center gap-4 text-green-600 ">
 <ShieldCheck className="w-8 h-8 shrink-0" />
 <div>
 <h4 className="font-bold mb-1">No biases detected</h4>
 <p className="text-sm opacity-80">This text appears neutral.</p>
 </div>
 </div>
 ) : (
 analysis.detectedBiases?.map((bias, idx) => (
 <div key={idx} className="bg-theme-card-bg/60 border border-theme-card-border p-4 rounded-3xl hover:border-theme-accent transition-colors group">
 <div className="flex items-start justify-between mb-2">
 <h4 className="text-md font-bold font-serif text-theme-heading flex items-center gap-2">
 <TrendingUp className="w-4 h-4 text-theme-accent " />
 {bias.type}
 </h4>
 <span className={`px-2 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full border ${bias.impact.toLowerCase() === 'high' ? 'bg-red-500/10 text-red-600 border-red-500/30' :
 bias.impact.toLowerCase() === 'medium' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30' :
 'bg-theme-accent/10 text-theme-accent border-theme-accent/30 '
 }`}>
 {bias.impact}
 </span>
 </div>
 <p className="text-theme-text text-sm leading-relaxed border-l-2 border-theme-accent/30 pl-4 py-1 italic font-light">
 {bias.explanation}
 </p>
 </div>
 ))
 )}
 </div>
 </div>
 </motion.div>
 )}
 </div>
 </div>
 </main>
 );
}
