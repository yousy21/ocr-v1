"use client";

import { useState } from "react";
import UploadCard from "./UploadCard";

export default function LocataireSection({ dossierId }: { dossierId: string }) {
    const [fields, setFields] = useState<any>({
        full_name: "",
        birth_date: "",
        birth_place: "",
        national_id: "",
        address: "",
    });

    // Simulate OCR mapping
    function simulateOCR(file: File) {
        setFields({
            full_name: "Omar Medjadj",
            birth_date: "1998-04-10",
            birth_place: "Oran",
            national_id: "123456789012",
            address: "Hai El Badr, Oran",
        });
    }

    return (
        <section className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Informations du Locataire</h2>

            <UploadCard label="Importer la pièce d'identité du locataire" onUploaded={simulateOCR} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <input
                    className="p-3 rounded-xl bg-gray-100 shadow-inner"
                    placeholder="Nom complet"
                    value={fields.full_name}
                    onChange={(e) => setFields({ ...fields, full_name: e.target.value })}
                />

                <input
                    className="p-3 rounded-xl bg-gray-100 shadow-inner"
                    placeholder="Numéro d'identité"
                    value={fields.national_id}
                    onChange={(e) => setFields({ ...fields, national_id: e.target.value })}
                />

                <input
                    className="p-3 rounded-xl bg-gray-100 shadow-inner"
                    placeholder="Date de naissance"
                    value={fields.birth_date}
                    onChange={(e) => setFields({ ...fields, birth_date: e.target.value })}
                />

                <input
                    className="p-3 rounded-xl bg-gray-100 shadow-inner"
                    placeholder="Lieu de naissance"
                    value={fields.birth_place}
                    onChange={(e) => setFields({ ...fields, birth_place: e.target.value })}
                />

                <input
                    className="p-3 rounded-xl bg-gray-100 shadow-inner md:col-span-2"
                    placeholder="Adresse"
                    value={fields.address}
                    onChange={(e) => setFields({ ...fields, address: e.target.value })}
                />
            </div>
        </section>
    );
}
