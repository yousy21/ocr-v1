"use client";

import { useState } from "react";

export default function OcrUploader({ onResult }: { onResult: (data: any) => void }) {
    const [loading, setLoading] = useState(false);

    async function handleFile(e: any) {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/ocr", {
            method: "POST",
            body: formData,
        });

        const json = await res.json();
        setLoading(false);

        if (json.error) return alert("OCR erreur");

        onResult(json.raw); // send raw OCR back
    }

    return (
        <div className="space-y-2">
            <input type="file" accept="image/*" onChange={handleFile} />

            {loading && <p className="text-blue-600">Analyse du CNI…</p>}
        </div>
    );
}
