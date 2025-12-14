"use client";

import CniCropper from "@/components/CniCropper";

export default function UploadCni() {
    const sendToBackend = async (file: File) => {
        const form = new FormData();
        form.append("file", file);

        const res = await fetch("/api/cni-ocr", {
            method: "POST",
            body: form
        });

        const data = await res.json();
        console.log("OCR Result:", data);
    };

    return (
        <div className="p-6">
            <h2 className="font-bold text-xl mb-3">Upload Algerian ID</h2>
            <CniCropper onCropped={sendToBackend} />
        </div>
    );
}
