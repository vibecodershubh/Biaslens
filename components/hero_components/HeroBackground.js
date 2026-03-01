"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function HeroBackground() {
    const canvasRef = useRef(null);
    const [mounted, setMounted] = useState(false);
    const totalFrames = 80;

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        let frameIndex = 0;
        let animationFrameId;

        // Array to hold preloaded images
        const images = [];

        // Load sequence
        for (let i = 0; i < totalFrames; i++) {
            const img = new Image();
            const paddedIndex = i.toString().padStart(3, "0");
            img.src = `/hero_components/Whisk_ygz5czylltoiftyh1yyxedotkto3qtl1cjyy0co_${paddedIndex}.jpg`;
            img.onload = () => {
                if (i === 0 && context) {
                    drawImageCover(context, img, canvas.width, canvas.height);
                }
            };
            images.push(img);
        }

        let lastTime = 0;
        const fps = 24; // Cinematic 24 FPS
        const frameInterval = 1000 / fps;

        const render = (time) => {
            if (time - lastTime >= frameInterval) {
                if (images[frameIndex] && images[frameIndex].complete) {
                    drawImageCover(context, images[frameIndex], canvas.width, canvas.height);
                }
                frameIndex = (frameIndex + 1) % totalFrames;
                lastTime = time;
            }
            animationFrameId = requestAnimationFrame(render);
        };

        // Start loop
        animationFrameId = requestAnimationFrame(render);

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            if (images[frameIndex] && images[frameIndex].complete) {
                drawImageCover(context, images[frameIndex], canvas.width, canvas.height);
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // trigger once to set correct initial canvas internal dimensions

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", handleResize);
        };
    }, [mounted]);

    // Object-fit: cover equivalent for canvas
    function drawImageCover(ctx, img, w, h) {
        if (!img || img.width === 0) return;
        const imgRatio = img.width / img.height;
        const canvasRatio = w / h;
        let drawWidth, drawHeight, offsetX, offsetY;

        if (imgRatio > canvasRatio) {
            drawHeight = h;
            drawWidth = h * imgRatio;
            offsetX = (w - drawWidth) / 2;
            offsetY = 0;
        } else {
            drawWidth = w;
            drawHeight = w / imgRatio;
            offsetX = 0;
            offsetY = (h - drawHeight) / 2;
        }

        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 w-screen h-screen overflow-hidden pointer-events-none -z-10 transition-colors duration-300 bg-theme-bg dark:bg-[#030303]">

            {/* Sequence Canvas */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full object-cover opacity-10 dark:opacity-30 mix-blend-multiply dark:mix-blend-screen transition-opacity duration-300 blur-[2px]"
            />

            {/* Light/Dark mode animated grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] transition-all duration-300"></div>

            {/* Animated Glowing Orbs */}
            <motion.div
                animate={{
                    x: [0, 100, 0, -100, 0],
                    y: [0, -50, -100, -50, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute top-[10%] left-[20%] w-[30rem] h-[30rem] bg-theme-accent/10 rounded-full blur-[100px] transition-all duration-300 mix-blend-multiply dark:mix-blend-normal"
            />
            <motion.div
                animate={{
                    x: [0, -100, 0, 100, 0],
                    y: [0, 50, 100, 50, 0],
                    scale: [1, 1.5, 1],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[20%] right-[10%] w-[25rem] h-[25rem] bg-theme-heading/10 rounded-full blur-[120px] transition-all duration-300 mix-blend-multiply dark:mix-blend-normal"
            />

            {/* Fade overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-theme-bg dark:to-[#030303] transition-colors duration-300"></div>
        </div>
    );
}
