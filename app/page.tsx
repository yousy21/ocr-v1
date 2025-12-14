"use client";

import { useState } from "react";
import CameraCapture from "../components/CameraCapture";
import { sendToOCR } from "../lib/ocrClient";

export default function Home() {
  const [ocrResult, setOcrResult] = useState(null);

  const handleUpload = async (file: File) => {
    const result = await sendToOCR(file);
    setOcrResult(result);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">DZ OCR Scanner</h1>

      <CameraCapture onCapture={handleUpload} />

      <div className="mt-6">
        {ocrResult && (
          <pre className="bg-gray-100 p-4 rounded-md text-sm">
            {JSON.stringify(ocrResult, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
