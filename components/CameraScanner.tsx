"use client";

import { useEffect, useRef, useState } from "react";
import { loadCV } from "@/lib/opencv";

interface Props {
    onScan: (file: File) => void;
}

export default function CameraScanner({ onScan }: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const overlayRef = useRef<HTMLCanvasElement>(null);

    const [cv, setCv] = useState<any>(null);
    const [autoScanLock, setAutoScanLock] = useState(false);

    // Stability tracking
    const lastRectRef = useRef<any>(null);
    const stableFrames = useRef(0);

    /* -----------------------------------------
       Load OpenCV once
    ------------------------------------------*/
    useEffect(() => {
        loadCV().then((cvLib: any) => setCv(cvLib));
    }, []);

    /* -----------------------------------------
       Rear Camera
    ------------------------------------------*/
    useEffect(() => {
        async function startCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: { ideal: "environment" },
                        width: { ideal: 1920 },
                        height: { ideal: 1080 },
                    },
                    audio: false,
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch {
                alert("Impossible d'accéder à la caméra");
            }
        }

        startCamera();
    }, []);

    /* -----------------------------------------
       LIVE DETECTION + AUTO CAPTURE
    ------------------------------------------*/
    useEffect(() => {
        if (!cv) return;

        const interval = setInterval(() => {
            if (!videoRef.current || !overlayRef.current) return;

            const video = videoRef.current;
            const overlay = overlayRef.current;
            const ctx = overlay.getContext("2d");

            overlay.width = video.videoWidth;
            overlay.height = video.videoHeight;

            if (!ctx) return;

            // Get frame
            let frame = new cv.Mat(video.videoHeight, video.videoWidth, cv.CV_8UC4);
            let cap = new cv.VideoCapture(video);
            cap.read(frame);

            let gray = new cv.Mat();
            let blurred = new cv.Mat();
            let edges = new cv.Mat();
            let contours = new cv.MatVector();
            let hierarchy = new cv.Mat();

            cv.cvtColor(frame, gray, cv.COLOR_RGBA2GRAY);
            cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);
            cv.Canny(blurred, edges, 60, 150);

            cv.findContours(edges, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);

            ctx.clearRect(0, 0, overlay.width, overlay.height);

            let biggest = null;
            let maxArea = 0;

            for (let i = 0; i < contours.size(); i++) {
                let cnt = contours.get(i);
                let peri = cv.arcLength(cnt, true);
                let approx = new cv.Mat();
                cv.approxPolyDP(cnt, approx, 0.02 * peri, true);

                if (approx.rows === 4) {
                    const area = cv.contourArea(cnt);
                    if (area > maxArea) {
                        maxArea = area;
                        biggest = approx;
                    }
                }
            }

            if (biggest) {
                ctx.strokeStyle = "#00ff00";
                ctx.lineWidth = 5;

                ctx.beginPath();
                for (let i = 0; i < 4; i++) {
                    const x = biggest.intAt(i, 0);
                    const y = biggest.intAt(i, 1);
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.stroke();
            }

            /* -----------------------------------------
               AUTO-CAPTURE LOGIC
            ------------------------------------------*/
            if (biggest) {
                const pts = Array.from({ length: 4 }, (_, i) => ({
                    x: biggest.intAt(i, 0),
                    y: biggest.intAt(i, 1),
                }));

                // Compute bounding box
                const minX = Math.min(...pts.map((p) => p.x));
                const maxX = Math.max(...pts.map((p) => p.x));
                const minY = Math.min(...pts.map((p) => p.y));
                const maxY = Math.max(...pts.map((p) => p.y));

                const width = maxX - minX;
                const height = maxY - minY;

                // Check size (close enough)
                const sizeOK = width > video.videoWidth * 0.45;

                // Check stability (rectangle not moving)
                const last = lastRectRef.current;

                if (
                    last &&
                    Math.abs(last.x - minX) < 15 &&
                    Math.abs(last.y - minY) < 15 &&
                    Math.abs(last.w - width) < 20
                ) {
                    stableFrames.current++;
                } else {
                    stableFrames.current = 0;
                }

                lastRectRef.current = { x: minX, y: minY, w: width };

                const stable = stableFrames.current > 10; // ~1s

                if (stable && sizeOK && !autoScanLock) {
                    setAutoScanLock(true);
                    captureAndScan();
                }
            }

            // Cleanup
            frame.delete();
            gray.delete();
            blurred.delete();
            edges.delete();
            contours.delete();
            hierarchy.delete();
            biggest?.delete();
        }, 80);

        return () => clearInterval(interval);
    }, [cv, autoScanLock]);

    /* -----------------------------------------
       FINAL CAPTURE & CROP
    ------------------------------------------*/
    const captureAndScan = async () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx?.drawImage(video, 0, 0);

        const cvLib = cv;
        const mat = cvLib.imread(canvas);

        // full crop logic same as before…

        // Convert to JPEG
        const temp = document.createElement("canvas");
        cvLib.imshow(temp, mat);

        temp.toBlob((blob) => {
            if (!blob) return;
            onScan(new File([blob], "cni_scan.jpg", { type: "image/jpeg" }));
        });

        mat.delete();
    };

    /* -----------------------------------------
       UI
    ------------------------------------------*/
    return (
        <div className="flex flex-col items-center gap-4 w-full">

            {/* Horizontal scanning */}
            <div className="relative w-full max-w-md h-[60vh] overflow-hidden bg-black">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="absolute top-1/2 left-1/2"
                    style={{
                        transform: "translate(-50%, -50%) rotate(90deg)",
                        height: "100vw",
                        objectFit: "cover",
                    }}
                />

                <canvas
                    ref={overlayRef}
                    className="absolute inset-0 pointer-events-none"
                    style={{ transform: "rotate(90deg)" }}
                />
            </div>

            <div className="text-gray-600 text-sm">
                Alignez la CNI dans le cadre. Scan automatique…
            </div>

            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
}
