"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
    onCapture: (file: File) => void;
}

export default function CameraCapture({ onCapture }: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [zoom, setZoom] = useState(1);

    useEffect(() => {
        async function startCamera() {
            let stream;

            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: { exact: "environment" },
                        width: { ideal: 1920 },
                        height: { ideal: 1080 },
                        zoom: true,
                    },
                    audio: false,
                });
            } catch {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment" },
                    audio: false,
                });
            }

            const track = stream.getVideoTracks()[0];
            const capabilities = track.getCapabilities();

            // If zoom supported by device, enable it
            if (capabilities.zoom) {
                const settings = track.getSettings();
                setZoom(settings.zoom || 1);
            }

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        }

        startCamera();
    }, []);

    // 🔎 Pinch to zoom (mobile gesture)
    const handleZoom = (delta: number) => {
        const track = (videoRef.current?.srcObject as MediaStream)
            ?.getVideoTracks?.()[0];
        if (!track) return;

        const capabilities = track.getCapabilities();
        if (!capabilities.zoom) return;

        let newZoom = zoom + delta;
        newZoom = Math.max(capabilities.zoom.min, Math.min(newZoom, capabilities.zoom.max));

        track.applyConstraints({ advanced: [{ zoom: newZoom }] });
        setZoom(newZoom);
    };

    // 🖼 Capture photo exactly inside the CNI frame
    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas) return;

        const frameWidth = video.videoWidth;
        const frameHeight = video.videoHeight;

        canvas.width = frameWidth;
        canvas.height = frameHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(video, 0, 0, frameWidth, frameHeight);

        canvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
                onCapture(file);
            }
        }, "image/jpeg");
    };

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            <div
                className="relative w-full max-w-xl aspect-video bg-black rounded-lg overflow-hidden"
                onWheel={(e) => handleZoom(e.deltaY * -0.01)}
            >
                {/* Camera video */}
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover rotate-90"
                />

                {/* CNI frame overlay (ID-1 ratio 1.586) */}
                <div
                    className="absolute inset-0 flex justify-center items-center"
                    style={{ pointerEvents: "none" }}
                >
                    <div
                        className="border-4 border-green-400 rounded-lg opacity-80"
                        style={{
                            width: "70%",
                            aspectRatio: "1.586",
                        }}
                    />
                </div>
            </div>

            <button
                onClick={capturePhoto}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-md active:scale-95"
            >
                📸 Capture CNI
            </button>

            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
}
