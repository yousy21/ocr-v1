"use client";

import { useState } from "react";
import UploadCard from "./UploadCard";

export default function BailleurSection({ dossierId }: { dossierId: string }) {
    const [fields, setFields] = useState<any>({
        name: "",
        birth_date: "",
        birth_place: "",
        national_id: "",
        address: "",
    });

    function simulateOCR(file: File) {
        setFields({
            full_name: "Boualem Khelifa",
            birth_date: "1985-02-17",
            birth_place: "Mostaganem",
            national_id: "987654321000",
            address: "Mostaganem, Kharouba",
        });
    }

    return (
        <section className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Informations du Bailleur</h2>

            <UploadCard label="Importer la pièce d'identité du bailleur" onUploaded={simulateOCR} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <input className="p-3 rounded-xl bg-gray-100 shadow-inner" placeholder="Nom complet" value={fields.name} />

                <input className="p-3 rounded-xl bg-gray-100 shadow-inner" placeholder="Numéro d'identité" value={fields.national_id} />

                <input className="p-3 rounded-xl bg-gray-100 shadow-inner" placeholder="Date de naissance" value={fields.birth_date} />

                <input className="p-3 rounded-xl bg-gray-100 shadow-inner" placeholder="Lieu de naissance" value={fields.birth_place} />

                <input className="p-3 rounded-xl bg-gray-100 shadow-inner md:col-span-2" placeholder="Adresse" value={fields.address} />
            </div>
        </section>
    );
}
