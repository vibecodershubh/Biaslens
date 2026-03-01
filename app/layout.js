import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
    title: "BiasLens | Cognitive Analysis Engine",
    description: "Unmask the bias in every story with AI-powered media analysis.",
    openGraph: {
        title: "BiasLens",
        description: "Next-gen media analysis using AI.",
        url: "https://biaslens-clone.vercel.app",
        siteName: "BiasLens",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
            }
        ],
        locale: "en-US",
        type: "website",
    }
};

import FloatingChat from "@/components/FloatingChat";
import { Providers } from "./providers";

import { Inter, Playfair_Display } from "next/font/google";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
});

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-serif",
});

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`dark ${inter.variable} ${playfair.variable}`}>
            <body className="min-h-screen relative overflow-x-hidden transition-colors duration-300 font-sans">
                <Providers>
                    <div className="vignette-bg"></div>
                    <Navbar />
                    {children}
                    <FloatingChat />
                </Providers>
            </body>
        </html>
    );
}
