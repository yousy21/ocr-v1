"use client";

import { useState } from "react";

type LocataireData = {
    nom?: string;
    prenom?: string;
    cin?: string;
    date_naissance?: string; // YYYY-MM-DD (input format)
    lieu_naissance?: string;
    address?: string;
    gender?: string; // Fixed: added gender property
    authority?: string;
    ocr_raw?: string;
};

export default function StepLocataire({
    data,
    onChange,
}: {
    data: LocataireData;
    onChange: (updated: LocataireData) => void;
}) {
    const [loadingOCR, setLoadingOCR] = useState(false);

    // ------------------------------------------------------------------
    // Convert OCR date "21/04/1995" → "1995-04-21" (HTML <input type="date">)
    // ------------------------------------------------------------------
    function convertDate(d?: string) {
        if (!d) return "";
        const parts = d.split("/");
        if (parts.length !== 3) return d;
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    // ------------------------------------------------------------------
    // Normalize Arabic gender → ("M" | "F")
    // ------------------------------------------------------------------
    function normalizeGender(g?: string) {
        if (!g) return "";
        if (g.includes("أنثى")) return "F";
        if (g.includes("ذكر")) return "M";
        return "";
    }

    // ------------------------------------------------------------------
    // OCR Upload Handler
    // ------------------------------------------------------------------
    async function handleOCR(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoadingOCR(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            // 1️⃣ CALL THE PYTHON OCR SERVER
            const res = await fetch("/api/ocr/scan", {
                method: "POST",
                body: formData,
            });

            const json = await res.json();

            if (!json.ok || !json.data) {
                alert("Erreur OCR: Impossible de lire la carte.");
                setLoadingOCR(false);
                return;
            }

            const d = json.data;
            console.log("🟢 OCR Extracted:", d);

            // 2️⃣ MAP ALGERIAN ID CARD FIELDS
            onChange({
                nom: d.last_name || "",
                prenom: d.first_name || "",
                cin: d.national_id || "",
                date_naissance: convertDate(d.birth_date),
                lieu_naissance: d.birth_place || "",
                gender: normalizeGender(d.gender),
                authority: d.authority || "",
                address: "", // CNI verso does NOT include address
                ocr_raw: JSON.stringify(d, null, 2),
            });
        } catch (err) {
            console.error("OCR Error:", err);
            alert("Erreur OCR.");
        }

        setLoadingOCR(false);
    }

    // ------------------------------------------------------------------
    // UI
    // ------------------------------------------------------------------
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Informations du locataire</h2>

            {/* Upload Area */}
            <div className="p-4 border rounded-xl bg-gray-50">
                <label className="block font-medium mb-2">Importer pièce d'identité</label>

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleOCR}
                    className="block w-full"
                />

                {loadingOCR && (
                    <p className="text-blue-600 mt-2 animate-pulse">Analyse OCR en cours…</p>
                )}
            </div>

            {/* Form fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <input
                    type="text"
                    placeholder="Nom"
                    value={data.nom || ""}
                    onChange={(e) => onChange({ ...data, nom: e.target.value })}
                    className="border rounded-xl p-3"
                />

                <input
                    type="text"
                    placeholder="Prénom"
                    value={data.prenom || ""}
                    onChange={(e) => onChange({ ...data, prenom: e.target.value })}
                    className="border rounded-xl p-3"
                />

                <input
                    type="text"
                    placeholder="Numéro d'identité (CIN/NNI)"
                    value={data.cin || ""}
                    onChange={(e) => onChange({ ...data, cin: e.target.value })}
                    className="border rounded-xl p-3"
                />

                <input
                    type="date"
                    placeholder="Date de naissance"
                    value={data.date_naissance || ""}
                    onChange={(e) => onChange({ ...data, date_naissance: e.target.value })}
                    className="border rounded-xl p-3"
                />

                <input
                    type="text"
                    placeholder="Lieu de naissance"
                    value={data.lieu_naissance || ""}
                    onChange={(e) => onChange({ ...data, lieu_naissance: e.target.value })}
                    className="border rounded-xl p-3"
                />

                <select
                    value={data.gender || ""}
                    onChange={(e) => onChange({ ...data, gender: e.target.value })}
                    className="border rounded-xl p-3 bg-white"
                >
                    <option value="">Sélectionner le genre</option>
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                </select>

                <input
                    type="text"
                    placeholder="Adresse (optionnel)"
                    value={data.address || ""}
                    onChange={(e) => onChange({ ...data, address: e.target.value })}
                    className="border rounded-xl p-3 md:col-span-2"
                />
            </div>
        </div>
    );
}
