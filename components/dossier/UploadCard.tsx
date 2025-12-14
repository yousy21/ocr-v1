"use client";

import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";

export default function UploadCard({
    label,
    onUploaded,
}: {
    label: string;
    onUploaded: (file: File) => void;
}) {
    const [loading, setLoading] = useState(false);

    async function handleFileSelect(e: any) {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        await new Promise((r) => setTimeout(r, 1500)); // simulate OCR time
        setLoading(false);

        onUploaded(file);
    }

    return (
        <div className="p-6 bg-white rounded-2xl shadow-xl">
            <p className="font-semibold mb-3">{label}</p>

            <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition">
                {loading ? (
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                ) : (
                    <>
                        <Upload className="w-8 h-8 text-gray-400" />
                        <p className="text-sm text-gray-600 mt-2">Déposer le document ou cliquer</p>
                    </>
                )}

                <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
            </label>
        </div>
    );
}
