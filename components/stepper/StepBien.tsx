"use client";

export default function StepBien({ data, onChange }: any) {
    function update(key: string, value: string) {
        onChange({ ...data, [key]: value });
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
                className="p-3 rounded-xl bg-gray-100 shadow-inner"
                placeholder="Adresse du bien"
                value={data.property_address || ""}
                onChange={(e) => update("property_address", e.target.value)}
            />

            <input
                className="p-3 rounded-xl bg-gray-100 shadow-inner"
                placeholder="Montant du loyer (DZD)"
                value={data.rent_amount || ""}
                onChange={(e) => update("rent_amount", e.target.value)}
            />

            <input
                className="p-3 rounded-xl bg-gray-100 shadow-inner"
                placeholder="Durée (mois)"
                value={data.rent_duration_months || ""}
                onChange={(e) => update("rent_duration_months", e.target.value)}
            />

            <input
                className="p-3 rounded-xl bg-gray-100 shadow-inner"
                placeholder="Mode de paiement"
                value={data.payment_mode || ""}
                onChange={(e) => update("payment_mode", e.target.value)}
            />
        </div>
    );
}
