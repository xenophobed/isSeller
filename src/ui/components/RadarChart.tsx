"use client";

// src/ui/components/RadarChart.tsx
import { useEffect, useRef } from "react";

interface RadarChartProps {
	scores: {
		bass: number;
		midRange: number;
		treble: number;
		soundstage: number;
		detail: number;
		comfort: number;
	};
	size?: "small" | "large";
}

export function RadarChart({ scores, size = "small" }: RadarChartProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const centerX = canvas.width / 2;
		const centerY = canvas.height / 2;
		const radius = size === "small" ? 50 : 80;

		// Clear canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Draw background
		ctx.beginPath();
		ctx.fillStyle = "rgba(243, 244, 246, 0.5)";
		ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
		ctx.fill();

		// Draw radar chart
		const points = Object.values(scores);
		const angleStep = (Math.PI * 2) / points.length;

		// Draw lines
		ctx.beginPath();
		ctx.strokeStyle = "rgb(59, 130, 246)";
		ctx.lineWidth = 2;

		points.forEach((score, index) => {
			const angle = index * angleStep - Math.PI / 2;
			const x = centerX + Math.cos(angle) * ((radius * score) / 10);
			const y = centerY + Math.sin(angle) * ((radius * score) / 10);

			if (index === 0) {
				ctx.moveTo(x, y);
			} else {
				ctx.lineTo(x, y);
			}
		});

		ctx.closePath();
		ctx.stroke();

		// Fill area
		ctx.fillStyle = "rgba(59, 130, 246, 0.2)";
		ctx.fill();

		// Draw labels if size is large
		if (size === "large") {
			ctx.fillStyle = "rgb(75, 85, 99)";
			ctx.font = "12px sans-serif";
			ctx.textAlign = "center";

			const labels = ["Bass", "Mid", "Treble", "Stage", "Detail", "Comfort"];
			points.forEach((_, index) => {
				const angle = index * angleStep - Math.PI / 2;
				const x = centerX + Math.cos(angle) * (radius + 20);
				const y = centerY + Math.sin(angle) * (radius + 20);
				ctx.fillText(labels[index], x, y);
			});
		}
	}, [scores, size]);

	return (
		<div className="relative">
			<canvas
				ref={canvasRef}
				width={size === "small" ? 120 : 200}
				height={size === "small" ? 120 : 200}
				className="mx-auto"
			/>
		</div>
	);
}
