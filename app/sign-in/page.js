"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Shield } from "lucide-react";
import HeroBackground from "@/components/hero_components/HeroBackground";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
    const [isRegistering, setIsRegistering] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleAuth = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (isRegistering) {
            try {
                const res = await fetch("/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password, name }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Registration failed");

                // Immediately log in upon successful register
                const loginRes = await signIn("credentials", {
                    email, password, redirect: false
                });

                if (loginRes?.error) {
                    setError("Registered successfully but failed to log in automatically.");
                    setIsLoading(false);
                } else {
                    router.push("/");
                    router.refresh();
                }
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        } else {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError("Invalid credentials. Please try again.");
                setIsLoading(false);
            } else {
                router.push("/");
                router.refresh();
            }
        }
    };

    return (
        <main className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center justify-center relative">
            <HeroBackground />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md relative z-10"
            >
                <div className="relative group">
                    <div className="absolute inset-0 bg-theme-accent/5 rounded-3xl blur-xl group-hover:bg-theme-accent/10 transition-all duration-300"></div>
                    <div className="relative bg-theme-card-bg/80 backdrop-blur-xl border border-theme-card-border rounded-3xl p-8 sm:p-10 flex flex-col gap-8 shadow-2xl shadow-black/5">

                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="p-3 rounded-2xl bg-theme-accent/10 border border-theme-accent/20">
                                <Shield className="w-8 h-8 text-theme-accent" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black font-serif tracking-tight text-theme-heading mb-2">
                                    {isRegistering ? "Initialize Access" : "Welcome Back"}
                                </h1>
                                <p className="text-sm text-theme-text/80 font-light">
                                    {isRegistering ? "Register to access the Cognitive Analysis Engine" : "Authenticate to access the Cognitive Analysis Engine"}
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleAuth} className="flex flex-col gap-5">
                            {isRegistering && (
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-theme-text/80 ml-1">
                                        Operator Name
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            required={isRegistering}
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter your name"
                                            className="w-full bg-theme-bg/50 border border-theme-card-border rounded-xl py-3 px-4 text-theme-text placeholder:text-theme-text/40 focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent transition-all duration-300"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-theme-text/80 ml-1">
                                    Operator ID (Email)
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-accent/60" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="w-full bg-theme-bg/50 border border-theme-card-border rounded-xl py-3 pl-12 pr-4 text-theme-text placeholder:text-theme-text/40 focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent transition-all duration-300"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-xs font-bold uppercase tracking-widest text-theme-text/80">
                                        Access Key (Password)
                                    </label>
                                    {!isRegistering && (
                                        <Link href="#" className="text-[10px] font-bold uppercase tracking-wider text-theme-accent hover:underline">
                                            Forgot Key?
                                        </Link>
                                    )}
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-accent/60" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        className="w-full bg-theme-bg/50 border border-theme-card-border rounded-xl py-3 pl-12 pr-4 text-theme-text placeholder:text-theme-text/40 focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent transition-all duration-300"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="text-sm font-semibold text-rose-500 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-xl text-center">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="mt-2 w-full bg-theme-accent hover:bg-theme-accent-hover text-theme-accent-text py-3.5 rounded-xl text-sm font-semibold tracking-widest uppercase shadow-lg shadow-theme-accent/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:pointer-events-none"
                            >
                                {isLoading ? "Authenticating..." : (isRegistering ? "Create Profile" : "Initiate Link")}
                                {!isLoading && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
                            </button>
                        </form>

                        <div className="flex flex-col gap-4">
                            <div className="relative flex items-center">
                                <div className="flex-grow border-t border-theme-card-border" />
                                <span className="flex-shrink-0 mx-4 text-xs font-bold uppercase tracking-[0.2em] text-theme-text/40">
                                    Or Continue With
                                </span>
                                <div className="flex-grow border-t border-theme-card-border" />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button className="flex items-center justify-center py-2.5 bg-theme-bg/50 hover:bg-theme-bg border border-theme-card-border rounded-xl transition-colors duration-300">
                                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                </button>
                                <button className="flex items-center justify-center py-2.5 bg-theme-bg/50 hover:bg-theme-bg border border-theme-card-border rounded-xl transition-colors duration-300">
                                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-theme-text" fill="currentColor">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="mt-8 text-center text-xs font-bold uppercase tracking-widest text-theme-text/60">
                    {isRegistering ? "Already have neural clearance?" : "Need neural clearance?"}{" "}
                    <button onClick={() => setIsRegistering(!isRegistering)} className="text-theme-accent hover:underline">
                        {isRegistering ? "Authenticate" : "Request Access"}
                    </button>
                </p>
            </motion.div>
        </main>
    );
}
