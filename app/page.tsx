"use client";

import { useState, useRef, useEffect } from "react";
import CameraCapture from "../components/CameraCapture";
import { sendToOCR } from "../lib/ocrClient";
import { extract_cni_data } from "../lib/extractCNI";

export default function Home() {
  const [ocrResult, setOcrResult] = useState<any>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = async (file: File) => {
    setIsProcessing(true);
    // Create local URL for preview
    const url = URL.createObjectURL(file);
    setCapturedImage(url);
    setOcrResult(null);
    setExtractedData(null);

    try {
      const result = await sendToOCR(file);
      setOcrResult(result);

      // Parse data if full text is available
      if (result && result.fullTextAnnotation) {
        const data = extract_cni_data(result.fullTextAnnotation.text);
        setExtractedData(data);
      }
    } catch (e) {
      console.error(e);
      alert("Erreur lors de l'analyse OCR");
    } finally {
      setIsProcessing(false);
    }
  };

  // Draw boxes on the canvas
  useEffect(() => {
    if (!capturedImage || !canvasRef.current) return;

    const img = new Image();
    img.src = capturedImage;
    img.onload = () => {
      const canvas = canvasRef.current!;
      // Match canvas size to image size
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Draw the original image
      ctx.drawImage(img, 0, 0);

      // If we have OCR results, draw the boxes
      if (ocrResult && ocrResult.textAnnotations) {
        ctx.strokeStyle = "#00ff00"; // Green
        ctx.lineWidth = 3;

        // textAnnotations[0] is the whole text, so we start at 1 for individual words/lines
        const annotations = ocrResult.textAnnotations;
        for (let i = 1; i < annotations.length; i++) {
          const poly = annotations[i].boundingPoly;
          if (poly && poly.vertices) {
            ctx.beginPath();
            const v = poly.vertices;
            // Handle potentially missing vertices by defaulting or skipping
            if (v.length >= 4) {
              ctx.moveTo(v[0].x || 0, v[0].y || 0);
              ctx.lineTo(v[1].x || 0, v[1].y || 0);
              ctx.lineTo(v[2].x || 0, v[2].y || 0);
              ctx.lineTo(v[3].x || 0, v[3].y || 0);
              ctx.closePath();
              ctx.stroke();
            }
          }
        }
      }
    };
  }, [capturedImage, ocrResult]);

  return (
    <div className="p-4 max-w-xl mx-auto flex flex-col items-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Scanner CNI Algérienne</h1>

      {!capturedImage ? (
        <CameraCapture onCapture={handleUpload} />
      ) : (
        <div className="w-full flex flex-col gap-6">

          {/* Wrapper for the canvas/image */}
          <div className="relative w-full bg-black rounded-lg overflow-hidden shadow-lg border border-gray-300">
            {isProcessing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white z-20 backdrop-blur-sm">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mb-2"></div>
                <p className="font-semibold">Analyse en cours...</p>
              </div>
            )}
            {/* Canvas will render image + boxes */}
            <canvas ref={canvasRef} className="w-full h-auto block" />
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => { setCapturedImage(null); setOcrResult(null); setExtractedData(null); }}
              className="flex-1 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition"
            >
              Scanner à nouveau
            </button>
          </div>

          {extractedData && (
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200 w-full animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-xl font-bold mb-4 text-green-700 border-b pb-2">Données extraites</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                <div><span className="text-xs uppercase font-bold text-gray-500">NNI</span> <p className="font-medium text-lg">{extractedData.nni || "-"}</p></div>
                <div><span className="text-xs uppercase font-bold text-gray-500">Nom</span> <p className="font-medium text-lg">{extractedData.nom || "-"}</p></div>
                <div><span className="text-xs uppercase font-bold text-gray-500">Prénom</span> <p className="font-medium text-lg">{extractedData.prenom || "-"}</p></div>
                <div><span className="text-xs uppercase font-bold text-gray-500">Sexe</span> <p className="font-medium text-lg">{extractedData.sexe || "-"}</p></div>
                <div><span className="text-xs uppercase font-bold text-gray-500">Date Naissance</span> <p className="font-medium text-lg">{extractedData.date_naissance || "-"}</p></div>
                <div><span className="text-xs uppercase font-bold text-gray-500">Lieu Naissance</span> <p className="font-medium text-lg">{extractedData.lieu_naissance || "-"}</p></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
