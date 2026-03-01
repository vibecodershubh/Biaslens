"use client";
import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, Loader2 } from "lucide-react";

export default function FloatingChat({ articleTitle, articleContext }) {
 const [isOpen, setIsOpen] = useState(false);

 const initialMessage = articleTitle
 ? `Hello! I am ready to analyze **${articleTitle}**. Ask me about its bias, emotional tone, or political tilt.`
 : `Hello! I am your global intelligence AI. You can ask me to compare live news articles, detect misinformation patterns, or explain complex news topics simply.`;

 const [messages, setMessages] = useState([
 { role: "assistant", content: initialMessage }
 ]);
 const [input, setInput] = useState("");
 const [isLoading, setIsLoading] = useState(false);
 const messagesEndRef = useRef(null);

 const scrollToBottom = () => {
 messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
 };

 useEffect(() => {
 scrollToBottom();
 }, [messages]);

 const sendMessage = async (e) => {
 e.preventDefault();
 if (!input.trim() || isLoading) return;

 const userMessage = { role: "user", content: input.trim() };
 setMessages((prev) => [...prev, userMessage]);
 setInput("");
 setIsLoading(true);

 try {
 const response = await fetch("/api/assistant", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({
 messages: [...messages, userMessage],
 articleContext: articleContext ? `Title: ${articleTitle}\n${articleContext}` : "General News Inquiry - No specific article selected.",
 }),
 });

 if (!response.ok) {
 throw new Error(`API Error: ${response.status}`);
 }

 if (!response.body) throw new Error("No response body");

 const reader = response.body.getReader();
 const decoder = new TextDecoder();
 let assistantContent = "";

 // Add a placeholder message for the assistant
 setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

 while (true) {
 const { value, done } = await reader.read();
 if (done) break;
 assistantContent += decoder.decode(value, { stream: true });

 // Update the last message
 setMessages((prev) => {
 const newMessages = [...prev];
 newMessages[newMessages.length - 1].content = assistantContent;
 return newMessages;
 });
 }
 } catch (error) {
 console.error(error);
 setMessages((prev) => [...prev, { role: "system", content: "Error connecting to AI." }]);
 } finally {
 setIsLoading(false);
 }
 };

 return (
 <>
 <button
 onClick={() => setIsOpen(true)}
 className={`fixed bottom-6 right-6 p-4 rounded-full bg-theme-accent hover:bg-theme-accent-hover text-theme-accent-text shadow-xl active:scale-95 transition-all z-50 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
 >
 <MessageSquare className="w-6 h-6" />
 </button>

 {isOpen && (
 <div className="fixed bottom-6 right-6 w-full max-w-[380px] h-[550px] bg-theme-card-bg/95 backdrop-blur-xl border border-theme-card-border rounded-2xl shadow-xl flex flex-col z-50 overflow-hidden (99,102,241,0.15)] animate-in slide-in-from-bottom-5 transition-colors">
 <div className="flex items-center justify-between px-4 py-3 bg-theme-card-bg/50 border-b border-theme-card-border relative overflow-hidden">
 <div className="absolute inset-0 bg-gradient-to-r from-theme-accent/20 to-transparent"></div>
 <div className="flex items-center gap-2 relative">
 <span className="relative flex h-3 w-3">
 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-theme-accent opacity-75"></span>
 <span className="relative inline-flex rounded-full h-3 w-3 bg-theme-accent "></span>
 </span>
 <Bot className="w-5 h-5 text-theme-accent " />
 <span className="font-bold text-sm tracking-widest uppercase text-theme-heading ">Neural Hub</span>
 </div>
 <button onClick={() => setIsOpen(false)} className="text-theme-text/80 hover:text-theme-heading transition-colors relative">
 <X className="w-5 h-5" />
 </button>
 </div>

 <div className="flex-1 overflow-y-auto p-4 space-y-4">
 {messages.map((msg, idx) => (
 <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
 <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user'
 ? 'bg-theme-accent text-theme-accent-text rounded-br-sm shadow-md '
 : msg.role === 'system'
 ? 'bg-red-500/10 text-red-600 border border-red-500/20 '
 : 'bg-theme-card-bg/80 text-theme-text border border-theme-card-border rounded-bl-sm prose prose-sm dark:prose-invert prose-p:my-0 shadow-sm '
 }`}>
 {msg.content}
 </div>
 </div>
 ))}
 {isLoading && (
 <div className="flex justify-start">
 <div className="bg-theme-card-bg/80 px-4 py-3 rounded-2xl rounded-bl-sm border border-theme-card-border flex items-center gap-2">
 <Loader2 className="w-4 h-4 animate-spin text-theme-accent " />
 <span className="text-xs text-theme-text/80 uppercase tracking-widest font-bold">Thinking...</span>
 </div>
 </div>
 )}
 <div ref={messagesEndRef} />
 </div>

 <form onSubmit={sendMessage} className="p-3 bg-theme-card-bg/50 border-t border-theme-card-border ">
 <div className="relative">
 <input
 type="text"
 value={input}
 onChange={(e) => setInput(e.target.value)}
 placeholder="Ask about breaking news..."
 className="w-full bg-theme-card-bg border border-theme-card-border rounded-xl pl-4 pr-12 py-3 text-sm text-theme-text focus:outline-none focus:border-theme-accent dark:focus:border-indigo-500/50 transition-colors shadow-sm placeholder-theme-text/50 "
 />
 <button
 type="submit"
 disabled={!input.trim() || isLoading}
 className="absolute right-2 top-2 p-1.5 rounded-lg bg-theme-accent/10 text-theme-accent hover:bg-theme-accent/20 disabled:opacity-50 disabled:hover:bg-theme-accent/10 transition-colors dark:disabled:hover:bg-indigo-500/10"
 >
 <Send className="w-4 h-4" />
 </button>
 </div>
 </form>
 </div>
 )}
 </>
 );
}
