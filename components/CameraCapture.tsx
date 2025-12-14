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

    const [cvReady, setCvReady] = useState(false);

    /* -------------------------------------------------------
        1. Load OpenCV safely
      ------------------------------------------------------- */
    useEffect(() => {
        const cv = loadCV();
        if (cv && typeof cv.imread === 'function') setCvReady(true);
    }, []);

    /* -------------------------------------------------------
        2. Start Camera (rear camera)
      ------------------------------------------------------- */
    useEffect(() => {
        async function startCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: { ideal: "environment" },
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                    },
                    audio: false,
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                alert("Unable to access camera");
            }
        }

        startCamera();
    }, []);

    /* -------------------------------------------------------
        3. Live edge detection overlay (like CamScanner)
      ------------------------------------------------------- */
    useEffect(() => {
        if (!cvReady) return;

        const cv = loadCV();

        const interval = setInterval(() => {
            if (!videoRef.current || !overlayRef.current) return;

            const video = videoRef.current;
            const overlay = overlayRef.current;
            const ctx = overlay.getContext("2d");

            overlay.width = video.videoWidth;
            overlay.height = video.videoHeight;

            if (!ctx) return;

            // Read video frame
            const mat = new cv.Mat(video.videoHeight, video.videoWidth, cv.CV_8UC4);
            const cap = new cv.VideoCapture(video);
            cap.read(mat);

            // Process: grayscale → blur → edges
            let gray = new cv.Mat();
            let blurred = new cv.Mat();
            let edges = new cv.Mat();
            let contours = new cv.MatVector();
            let hierarchy = new cv.Mat();

            cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY);
            cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0, 0, cv.BORDER_DEFAULT);
            cv.Canny(blurred, edges, 60, 150);

            cv.findContours(edges, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);

            // Clear overlay
            ctx.clearRect(0, 0, overlay.width, overlay.height);

            // Draw largest 4-corner contour
            let biggest = null;
            let maxArea = 0;

            for (let i = 0; i < contours.size(); i++) {
                let cnt = contours.get(i);
                let peri = cv.arcLength(cnt, true);

                let approx = new cv.Mat();
                cv.approxPolyDP(cnt, approx, 0.02 * peri, true);

                if (approx.rows === 4) {
                    let area = cv.contourArea(cnt);
                    if (area > maxArea) {
                        maxArea = area;
                        biggest = approx;
                    }
                }
            }

            if (biggest) {
                ctx.strokeStyle = "#00ff00";
                ctx.lineWidth = 4;

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

            mat.delete(); gray.delete(); blurred.delete(); edges.delete();
            contours.delete(); hierarchy.delete();

            if (biggest) biggest.delete();
        }, 120);

        return () => clearInterval(interval);
    }, [cvReady]);

    /* -------------------------------------------------------
        4. Capture & Auto-Crop (Perspective Fix)
      ------------------------------------------------------- */
    const captureAndScan = async () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx?.drawImage(video, 0, 0);

        const cv = loadCV();
        let mat = cv.imread(canvas);

        // same detection as overlay but final crop
        let gray = new cv.Mat();
        let blurred = new cv.Mat();
        let edges = new cv.Mat();
        let contours = new cv.MatVector();
        let hierarchy = new cv.Mat();

        cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY);
        cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0, 0, cv.BORDER_DEFAULT);
        cv.Canny(blurred, edges, 60, 180);

        cv.findContours(edges, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);

        let biggest = null;
        let biggestArea = 0;

        for (let i = 0; i < contours.size(); i++) {
            let cnt = contours.get(i);
            let peri = cv.arcLength(cnt, true);
            let approx = new cv.Mat();
            cv.approxPolyDP(cnt, approx, 0.02 * peri, true);

            if (approx.rows === 4) {
                let area = cv.contourArea(cnt);
                if (area > biggestArea) {
                    biggestArea = area;
                    biggest = approx;
                }
            }
        }

        if (!biggest) {
            alert("Impossible de détecter la CNI");
            return;
        }

        // Order points
        const pts = [];
        for (let i = 0; i < 4; i++)
            pts.push({ x: biggest.intAt(i, 0), y: biggest.intAt(i, 1) });

        pts.sort((a, b) => a.y - b.y);
        const top = pts.slice(0, 2).sort((a, b) => a.x - b.x);
        const bottom = pts.slice(2, 2).sort((a, b) => a.x - b.x);

        const ordered = [top[0], top[1], bottom[0], bottom[1]];

        // CNI real ratio
        const CARD_RATIO = 1.586;
        const w = 900;
        const h = Math.round(w / CARD_RATIO);

        const src = cv.matFromArray(4, 1, cv.CV_32FC2, [
            ordered[0].x, ordered[0].y,
            ordered[1].x, ordered[1].y,
            ordered[2].x, ordered[2].y,
            ordered[3].x, ordered[3].y,
        ]);

        const dst = cv.matFromArray(4, 1, cv.CV_32FC2, [
            0, 0,
            w, 0,
            0, h,
            w, h,
        ]);

        const M = cv.getPerspectiveTransform(src, dst);

        let output = new cv.Mat();
        cv.warpPerspective(mat, output, M, new cv.Size(w, h));

        // ENHANCE (CamScanner style)
        cv.cvtColor(output, output, cv.COLOR_RGBA2GRAY);
        cv.equalizeHist(output, output);

        // Convert to file
        const tmp = document.createElement("canvas");
        cv.imshow(tmp, output);

        tmp.toBlob((blob) => {
            if (!blob) return;

            const file = new File([blob], "cni_scanned.jpg", { type: "image/jpeg" });
            onScan(file);
        }, "image/jpeg");

        // cleanup
        mat.delete(); gray.delete(); blurred.delete(); edges.delete();
        contours.delete(); hierarchy.delete(); biggest?.delete();
        src.delete(); dst.delete(); M.delete(); output.delete();
    };

    /* -------------------------------------------------------
        UI
      ------------------------------------------------------- */
    return (
        <div className="flex flex-col items-center w-full gap-4">
            <div className="relative w-full max-w-lg">
                <video ref={videoRef} autoPlay playsInline className="rounded-lg w-full shadow-lg" />

                {/* Live overlay */}
                <canvas ref={overlayRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />
            </div>

            <button
                onClick={captureAndScan}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold shadow-md active:scale-95"
            >
                📸 Scanner automatiquement
            </button>

            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
}
