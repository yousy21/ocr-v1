"use client";

import { useEffect, useRef } from "react";

interface Props {
  onCapture: (file: File) => void;
}

export default function CameraCapture({ onCapture }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    async function startCamera() {
      let stream;

      try {
        // Try forcing rear camera
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { exact: "environment" } },
          audio: false
        });
      } catch {
        // Fallback
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false
        });
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    }

    startCamera();
  }, []);

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw the current frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to blob → file
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
        onCapture(file);
      }
    }, "image/jpeg");
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full max-w-xs rounded-lg shadow-md"
      />

      <button
        onClick={capturePhoto}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-md active:scale-95"
      >
        📸 Capture CNI
      </button>

      {/* Hidden canvas for converting frame → file */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
