"use client";
import { Shield, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
    const [theme, setTheme] = useState("dark");
    const [scrolled, setScrolled] = useState(false);
    const { data: session, status } = useSession();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);

        // Ensure theme initial state matches body class safely
        if (typeof document !== "undefined") {
            setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
        }

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleTheme = () => {
        const root = document.documentElement;
        if (theme === "dark") {
            setTheme("light");
            root.classList.remove("dark");
        } else {
            setTheme("dark");
            root.classList.add("dark");
        }
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-300 flex justify-between items-center px-8 ${scrolled ? "backdrop-blur-xl bg-theme-nav-bg border-b border-theme-card-border" : "bg-transparent"
                }`}
        >
            <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="p-2 rounded-xl bg-theme-accent/10 border border-theme-accent/20 group-hover:border-theme-accent/40 transition-colors duration-300">
                        <Shield className="w-5 h-5 text-theme-accent " />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold font-serif tracking-tight text-theme-heading group-hover:text-theme-accent transition-colors duration-300">
                            BiasLens
                        </span>
                        <span className="text-[10px] font-bold tracking-[0.2em] text-theme-text/60 transition-colors duration-300">
                            COGNITIVE ANALYSIS ENGINE
                        </span>
                    </div>
                </Link>
            </div>

            <div className="hidden md:flex items-center gap-8">
                {[
                    { label: "ANALYZE TEXT", href: "/analyze" },
                    { label: "LIVE NEWS", href: "/news" }
                ].map((link) => (
                    <Link
                        key={link.label}
                        href={link.href}
                        className="text-[11px] font-bold uppercase tracking-[0.2em] text-theme-text hover:text-theme-accent transition-colors duration-300"
                    >
                        {link.label}
                    </Link>
                ))}
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full border border-theme-card-border bg-theme-card-bg/50 backdrop-blur-xl shadow-sm transition-all duration-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-bold tracking-wider text-theme-text transition-colors duration-300">
                        NEURAL LINK ACTIVE
                    </span>
                </div>

                <button
                    onClick={toggleTheme}
                    className="relative w-10 h-10 flex items-center justify-center rounded-xl text-theme-text hover:text-theme-accent bg-theme-card-bg/80 border border-theme-card-border shadow-sm hover:bg-theme-card-bg transition-all duration-300 active:scale-95 overflow-hidden"
                    aria-label="Toggle Theme"
                >
                    <AnimatePresence mode="wait" initial={false}>
                        {theme === "dark" ? (
                            <motion.div
                                key="sun"
                                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                                transition={{ duration: 0.4, ease: "backOut" }}
                                className="absolute"
                            >
                                <Sun className="w-5 h-5" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="moon"
                                initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                                transition={{ duration: 0.4, ease: "backOut" }}
                                className="absolute"
                            >
                                <Moon className="w-5 h-5" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>

                {status === "loading" ? (
                    <div className="w-20 h-9 bg-theme-text/10 animate-pulse rounded-xl hidden sm:block"></div>
                ) : session ? (
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-bold tracking-widest text-theme-text uppercase hidden md:block">
                            {session.user.name}
                        </span>
                        <button
                            onClick={() => signOut()}
                            className="hidden sm:inline-flex items-center justify-center text-[10px] font-bold uppercase tracking-wider border border-theme-accent/20 hover:border-theme-accent text-theme-text hover:text-theme-accent px-4 py-2 rounded-xl transition-all duration-300 active:scale-95"
                        >
                            Sign Out
                        </button>
                    </div>
                ) : (
                    <Link href="/sign-in" className="hidden sm:inline-flex items-center justify-center text-[11px] font-bold uppercase tracking-wider bg-theme-accent hover:bg-theme-accent-hover text-theme-accent-text px-5 py-2.5 rounded-xl shadow-lg shadow-theme-accent/10 transition-all duration-300 active:scale-95">
                        Sign In
                    </Link>
                )}
            </div>
        </nav >
    );
}
