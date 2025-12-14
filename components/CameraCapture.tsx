"use client";

import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { validateCNI } from "@/lib/validateCNI";



export default function CameraCapture({ onCapture }: { onCapture: (file: File) => void }) {
    const webcamRef = useRef<Webcam>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const capture = async () => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (!imageSrc) return;

        // 1️⃣ Validate if the captured image matches the CNI aspect ratio
        const isCNI = await validateCNI(imageSrc);

        if (!isCNI) {
            alert("❌ Please align the Algerian ID card inside the frame.");
            return;
        }

        // 2️⃣ Convert base64 → file
        setPreview(imageSrc);

        const byteString = atob(imageSrc.split(",")[1]);
        const mimeString = "image/jpeg";
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);

        for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);

        const file = new File([ab], "capture.jpg", { type: mimeString });

        onCapture(file);
        setIsOpen(false);
    };
    return (
        <div className="w-full text-center">
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                    📸 Take a Picture
                </button>
            )}

            {isOpen && (
                <div className="flex flex-col items-center space-y-4">
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="rounded-lg w-full max-w-sm"
                    />

                    <button
                        onClick={capture}
                        className="bg-green-600 text-white px-4 py-2 rounded-md"
                    >
                        Capture
                    </button>

                    <button
                        onClick={() => setIsOpen(false)}
                        className="bg-gray-400 text-white px-4 py-2 rounded-md"
                    >
                        Cancel
                    </button>
                </div>
            )}

            {preview && (
                <div className="mt-3">
                    <img src={preview} className="rounded-lg shadow-md" />
                </div>
            )}
        </div>
    );
}
