"use client";

import { useState } from "react";
import { sendToOCR } from "../lib/ocrClient";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [ocrResult, setOcrResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    if (!selectedFile) return alert("Upload a CNI image first");

    setLoading(true);
    const data = await sendToOCR(selectedFile);
    setOcrResult(data);
    setLoading(false);
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">DZ OCR – CNI Scanner</h1>

      {/* File Picker */}
      <input
        type="file"
        accept="image/*"
        className="p-2 bg-white rounded shadow"
        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
      />

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={loading || !selectedFile}
        className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Scanning..." : "Scan CNI"}
      </button>

      {/* Result */}
      {ocrResult && (
        <div className="mt-6 w-full max-w-2xl bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-3">OCR Result</h2>
          <pre className="text-sm bg-gray-50 p-3 rounded border">
            {JSON.stringify(ocrResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
