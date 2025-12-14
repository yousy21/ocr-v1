"use client";
import { useEffect, useRef } from "react";

interface CameraCaptureProps {
    onCapture: (file: File) => void;
}

export default function CameraCapture({ onCapture }: CameraCaptureProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        async function startCamera() {
            let stream;

            try {
                // Try exact /environment/
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: { exact: "environment" } }
                });
            } catch (err) {
                // Fallback to environment
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment" }
                });
            }

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        }

        startCamera();
    }, []);

    const handleCapture = () => {
        if (videoRef.current) {
            const canvas = document.createElement("canvas");
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(videoRef.current, 0, 0);
                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
                        onCapture(file);
                    }
                }, "image/jpeg");
            }
        }
    };

    return (
        <div className="relative">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-auto rounded-lg"
            />
            <button
                onClick={handleCapture}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg"
            >
                Capture
            </button>
        </div>
    );
}
