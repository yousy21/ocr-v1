"use client";

import { useEffect, useRef, useState } from "react";

// Declare global cv object from opencv.js
declare global {
    interface Window {
        cv: any;
    }
}

interface Props {
    onCapture: (file: File) => void;
}

export default function SmartScanner({ onCapture }: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isReady, setIsReady] = useState(false);
    const [cvLoaded, setCvLoaded] = useState(false);

    // Load OpenCV
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://docs.opencv.org/4.5.2/opencv.js";
        script.async = true;
        script.onload = () => {
            // Wait for cv to be ready
            const checkCv = setInterval(() => {
                if (window.cv && window.cv.Mat) {
                    clearInterval(checkCv);
                    setCvLoaded(true);
                }
            }, 100);
        };
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    // Start camera
    useEffect(() => {
        async function start() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment" },
                });
                if (videoRef.current) videoRef.current.srcObject = stream;
            } catch (e) {
                alert("Camera error");
            }
        }
        start();
    }, []);

    // Process frames
    useEffect(() => {
        if (!cvLoaded) return;

        let interval: any;

        interval = setInterval(() => {
            if (!videoRef.current || !canvasRef.current) return;

            const video = videoRef.current;
            const canvas = canvasRef.current;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            ctx.drawImage(video, 0, 0);

            try {
                const cv = window.cv;
                // Read frame into OpenCV
                let src = cv.imread(canvas);
                let gray = new cv.Mat();
                let blurred = new cv.Mat();
                let edges = new cv.Mat();

                cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
                cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0, 0, cv.BORDER_DEFAULT);
                cv.Canny(blurred, edges, 60, 150);

                // Contours
                let contours = new cv.MatVector();
                let hierarchy = new cv.Mat();
                cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

                let best = null;
                let bestArea = 0;

                for (let i = 0; i < contours.size(); i++) {
                    let cnt = contours.get(i);
                    let peri = cv.arcLength(cnt, true);
                    let approx = new cv.Mat();
                    cv.approxPolyDP(cnt, approx, 0.02 * peri, true);

                    if (approx.rows === 4) {
                        let area = cv.contourArea(cnt);
                        if (area > bestArea) {
                            bestArea = area;
                            best = approx;
                        }
                    }
                }

                if (best) {
                    // Draw detection polygon
                    ctx.strokeStyle = "lime";
                    ctx.lineWidth = 3;
                    ctx.beginPath();

                    const p: Array<{ x: number; y: number }> = [];
                    for (let i = 0; i < 4; i++) {
                        p.push({
                            x: best.intAt(i, 0),
                            y: best.intAt(i, 1),
                        });
                    }

                    ctx.moveTo(p[0].x, p[0].y);
                    ctx.lineTo(p[1].x, p[1].y);
                    ctx.lineTo(p[2].x, p[2].y);
                    ctx.lineTo(p[3].x, p[3].y);
                    ctx.closePath();
                    ctx.stroke();

                    // Auto-capture if big enough
                    if (!isReady && bestArea > video.videoWidth * video.videoHeight * 0.25) {
                        setIsReady(true);
                        setTimeout(() => autoCapture(src, p), 400);
                    }
                }

                // Cleanup
                src.delete();
                gray.delete();
                blurred.delete();
                edges.delete();
                contours.delete();
                hierarchy.delete();
            } catch (e) {
                console.warn("OpenCV processing error:", e);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [isReady, cvLoaded]);

    // Auto-capture function
    function autoCapture(src: any, pts: any[]) {
        const cv = window.cv;
        const width = 900;
        const height = Math.round(width / 1.586);

        let srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
            pts[0].x, pts[0].y,
            pts[1].x, pts[1].y,
            pts[2].x, pts[2].y,
            pts[3].x, pts[3].y,
        ]);

        let dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
            0, 0,
            width, 0,
            0, height,
            width, height,
        ]);

        let M = cv.getPerspectiveTransform(srcTri, dstTri);
        let output = new cv.Mat();
        cv.warpPerspective(src, output, M, new cv.Size(width, height));

        // Enhance like CamScanner
        let enhanced = new cv.Mat();
        cv.cvtColor(output, enhanced, cv.COLOR_RGBA2GRAY);
        cv.equalizeHist(enhanced, enhanced);

        // Convert to File
        const tmp = document.createElement("canvas");
        tmp.width = width;
        tmp.height = height;

        cv.imshow(tmp, enhanced);

        tmp.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], "cni_scan.jpg", { type: "image/jpeg" });
                onCapture(file);
            }
        }, "image/jpeg");

        // Clean up
        output.delete();
        enhanced.delete();
        srcTri.delete();
        dstTri.delete();
        M.delete();
    }

    return (
        <div className="relative w-full max-w-lg mx-auto">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg shadow-md"
            />

            {/* Overlay frame */}
            <div className="absolute inset-0 border-4 border-white/50 rounded-xl pointer-events-none"></div>

            <canvas ref={canvasRef} className="hidden"></canvas>

            {!isReady && (
                <p className="absolute bottom-4 w-full text-center text-white text-lg font-semibold">
                    Alignez la CNI dans le cadre…
                </p>
            )}
        </div>
    );
}
