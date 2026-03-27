import { useRef, useEffect, useState } from "react";
import { Theme } from "./theme";

export function PerspectiveGrid() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const handleResize = () => {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const { width, height } = size;
        canvas.width = width;
        canvas.height = height;

        // Background
        ctx.fillStyle = Theme.colors.dark.contentBackground;
        ctx.fillRect(0, 0, width, height);

        // Vanishing point (slightly left and center vertically)
        const vx = width * 0.42;
        const vy = height * 0.48;

        // Grid config
        const gridLines = 10;
        const lineColor = "#ccc";
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 1;

        // Draw horizontal lines radiating from vanishing point
        for (let i = 0; i <= gridLines; i++) {
            const t = i / gridLines;

            // Left edge points
            const leftY = t * height;
            ctx.beginPath();
            ctx.moveTo(vx, vy);
            ctx.lineTo(0, leftY);
            ctx.stroke();

            // Right edge points
            ctx.beginPath();
            ctx.moveTo(vx, vy);
            ctx.lineTo(width, leftY);
            ctx.stroke();

            // Top edge points
            const topX = t * width;
            ctx.beginPath();
            ctx.moveTo(vx, vy);
            ctx.lineTo(topX, 0);
            ctx.stroke();

            // Bottom edge points
            ctx.beginPath();
            ctx.moveTo(vx, vy);
            ctx.lineTo(topX, height);
            ctx.stroke();
        }

        // Draw concentric rectangles (cross lines) for the grid squares
        const rings = 20;
        for (let i = 1; i <= rings; i++) {
            const t = i / rings;
            // Interpolate a rectangle from vanishing point outward
            const left = vx - (vx + 100) * t;
            const right = vx + (width - vx + 100) * t;
            const top = vy - (vy + 100) * t;
            const bottom = vy + (height - vy + 100) * t;

            ctx.beginPath();
            ctx.rect(left, top, right - left, bottom - top);
            ctx.stroke();
        }
    }, [size]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full"
            style={{ zIndex: 0 }}
        />
    );
}