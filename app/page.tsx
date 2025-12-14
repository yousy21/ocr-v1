"use client";

import { useState, useRef, useEffect } from "react";
import SmartScanner from "../components/SmartScanner";
import { sendToOCR } from "../lib/ocrClient";
import { extract_cni_data } from "../lib/extractCNI";
import ZoneViewer from "../components/ZoneViewer";

export default function Home() {
  const [ocrResult, setOcrResult] = useState<any>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [showCamera, setShowCamera] = useState(false);

  // NEW STATES for ZoneViewer
  const [zones, setZones] = useState<any[]>([]);
  const [zonesImages, setZonesImages] = useState<string[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    setIsProcessing(true);

    const url = URL.createObjectURL(file);
    setCapturedImage(url);
    setOcrResult(null);
    setExtractedData(null);
    setZones([]);
    setZonesImages([]);

    try {
      const result = await sendToOCR(file);
      setOcrResult(result);

      // Extract zones
      if (result?.ocr_result) setZones(result.ocr_result);
      if (result?.zones_images) setZonesImages(result.zones_images);

      // Extract useful text for parsing
      if (result?.ocr_result) {
        const flat = Object.assign({}, ...result.ocr_result);
        const text = Object.values(flat).map((v) => String(v)).join(" ");
        const parsed = extract_cni_data(text);
        setExtractedData(parsed);
      }

    } catch (e) {
      console.error(e);
      alert("Erreur OCR");
    } finally {
      setIsProcessing(false);
    }
  };

  // Draw bounding boxes
  useEffect(() => {
    if (!capturedImage || !canvasRef.current) return;

    const img = new Image();
    img.src = capturedImage;

    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);

      if (ocrResult?.boxes) {
        ctx.strokeStyle = "#00ff00";
        ctx.lineWidth = 3;

        for (const box of ocrResult.boxes) {
          if (!box) continue;
          const [x1, y1, x2, y2] = box;
          ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
        }
      }
    };
  }, [capturedImage, ocrResult]);

  return (
    <div className="p-4 max-w-xl mx-auto flex flex-col items-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Scanner CNI Algérienne</h1>

      {!capturedImage ? (
        <div className="w-full flex flex-col gap-4">
          {!showCamera ? (
            <>
              <button
                onClick={() => setShowCamera(true)}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition"
              >
                📸 Prendre une photo
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition"
              >
                📁 Importer une image
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </>
          ) : (
            <>
              <SmartScanner onCapture={handleUpload} />
              <button
                onClick={() => setShowCamera(false)}
                className="w-full py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600"
              >
                Annuler
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="w-full flex flex-col gap-6">

          <div className="relative w-full bg-black rounded-lg overflow-hidden shadow-lg border border-gray-300">
            {isProcessing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white backdrop-blur-sm z-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mb-2"></div>
                Analyse en cours...
              </div>
            )}
            <canvas ref={canvasRef} className="w-full h-auto block" />
          </div>

          <button
            onClick={() => {
              setCapturedImage(null);
              setOcrResult(null);
              setExtractedData(null);
              setZones([]);
              setZonesImages([]);
              setShowCamera(false);
            }}
            className="w-full py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700"
          >
            🔄 Scanner à nouveau
          </button>

          {/* Parsed CNI Data */}
          {extractedData && (
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200 w-full">
              <h2 className="text-xl font-bold mb-4 text-green-700 border-b pb-2">
                Données extraites
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p><strong>NNI :</strong> {extractedData.nni || "-"}</p>
                <p><strong>Nom :</strong> {extractedData.nom || "-"}</p>
                <p><strong>Prénom :</strong> {extractedData.prenom || "-"}</p>
                <p><strong>Sexe :</strong> {extractedData.sexe || "-"}</p>
                <p><strong>Date Naissance :</strong> {extractedData.date_naissance || "-"}</p>
                <p><strong>Lieu Naissance :</strong> {extractedData.lieu_naissance || "-"}</p>
              </div>
            </div>
          )}

          {/* 🔥 Zone Viewer (Cropped zones + OCR) */}
          {zones.length > 0 && (
            <ZoneViewer zones={zones} images={zonesImages} />
          )}
        </div>
      )}
    </div>
  );
}
