"use client";
import { useEffect, useRef } from "react";

export default function CameraCapture() {
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

    return (
        <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-auto rounded-lg"
        />
    );
}
