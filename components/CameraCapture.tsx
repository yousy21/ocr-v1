"use client";

import { useEffect, useRef, useState } from "react";
import cv from "@techstark/opencv-js";

interface Props {
    onCapture: (file: File) => void;
}

export default function CameraCapture({ onCapture }: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);


    /* -------------------------------
       AUTO CROP CNI FUNCTION
    --------------------------------*/
    const detectAndCropCNI = (mat: cv.Mat): cv.Mat | null => {
        let gray = new cv.Mat();
        let blurred = new cv.Mat();
        let edges = new cv.Mat();
        let contours = new cv.MatVector();
        let hierarchy = new cv.Mat();

        cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY);
        cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);
        cv.Canny(blurred, edges, 75, 200);

        cv.findContours(edges, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);

        let biggest = null;
        let biggestArea = 0;

        for (let i = 0; i < contours.size(); i++) {
            let cnt = contours.get(i);
            let peri = cv.arcLength(cnt, true);
            let approx = new cv.Mat();
            cv.approxPolyDP(cnt, approx, 0.02 * peri, true);

            // We want a 4-corner shape
            if (approx.rows === 4) {
                let area = cv.contourArea(cnt);
                if (area > biggestArea) {
                    biggestArea = area;
                    biggest = approx;
                }
            }
        }

        if (!biggest) {
            console.log("No CNI rectangle detected.");
            return null;
        }

        // Order points (OpenCV screws this up sometimes)
        const getPoints = (mat: cv.Mat) => {
            let pts = [];
            for (let i = 0; i < 4; i++) pts.push({
                x: mat.intAt(i, 0),
                y: mat.intAt(i, 1)
            });

            // Sort corners
            pts.sort((a, b) => a.y - b.y);
            const top = pts.slice(0, 2).sort((a, b) => a.x - b.x);
            const bottom = pts.slice(2, 2).sort((a, b) => a.x - b.x);

            return [top[0], top[1], bottom[0], bottom[1]];
        };

        let pts = getPoints(biggest);

        // Output width/height based on ISO ratio
        const CARD_RATIO = 1.586;
        const width = 800;
        const height = Math.round(width / CARD_RATIO);

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
        cv.warpPerspective(mat, output, M, new cv.Size(width, height));

        // Cleanup
        gray.delete();
        blurred.delete();
        edges.delete();
        contours.delete();
        hierarchy.delete();
        biggest.delete();
        srcTri.delete();
        dstTri.delete();
        M.delete();

        return output;
    };



    /* -------------------------------
       CAMERA + CAPTURE
    --------------------------------*/
    useEffect(() => {
        async function startCamera() {
            let stream;

            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: { exact: "environment" } },
                    audio: false,
                });
            } catch {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment" },
                    audio: false,
                });
            }

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        }

        startCamera();
    }, []);

    const capturePhoto = async () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Full frame -> OpenCV MAT
        let mat = cv.imread(canvas);

        // AUTO CROP
        let cropped = detectAndCropCNI(mat);

        mat.delete();

        if (!cropped) {
            alert("❌ Unable to detect the CNI. Please align it inside the frame.");
            return;
        }

        // Convert to Blob
        const tmpCanvas = document.createElement("canvas");
        cv.imshow(tmpCanvas, cropped);
        cropped.delete();

        tmpCanvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], "cni_cropped.jpg", { type: "image/jpeg" });
                onCapture(file);
            }
        }, "image/jpeg");
    };

    return (
        <div className="flex flex-col items-center gap-4 w-full">

            <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full max-w-xl rounded-lg shadow-lg rotate-90"
            />

            <button
                onClick={capturePhoto}
                className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md"
            >
                📸 AUTO-SCAN CNI
            </button>

            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
}
