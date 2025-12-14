"use client";

import { useState } from "react";

export default function BienSection({ dossierId }: { dossierId: string }) {
    const [bien, setBien] = useState<any>({
        property_address: "",
        rent_amount: "",
        rent_duration_months: "",
        payment_mode: "",
    });

    return (
        <section className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Informations du Bien</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-xl">
                <input
                    className="p-3 rounded-xl bg-gray-100 shadow-inner"
                    placeholder="Adresse du bien"
                    value={bien.property_address}
                    onChange={(e) => setBien({ ...bien, property_address: e.target.value })}
                />

                <input
                    className="p-3 rounded-xl bg-gray-100 shadow-inner"
                    placeholder="Montant du loyer (DZD)"
                    value={bien.rent_amount}
                    onChange={(e) => setBien({ ...bien, rent_amount: e.target.value })}
                />

                <input
                    className="p-3 rounded-xl bg-gray-100 shadow-inner"
                    placeholder="Durée (mois)"
                    value={bien.rent_duration_months}
                    onChange={(e) => setBien({ ...bien, rent_duration_months: e.target.value })}
                />

                <input
                    className="p-3 rounded-xl bg-gray-100 shadow-inner"
                    placeholder="Mode de paiement"
                    value={bien.payment_mode}
                    onChange={(e) => setBien({ ...bien, payment_mode: e.target.value })}
                />
            </div>
        </section>
    );
}
