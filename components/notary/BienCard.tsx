import Field from "@/components/ui/Field";
import { Home } from "lucide-react";

export default function BienCard({ data }: { data: any }) {
    return (
        <div className="p-6 bg-white rounded-2xl shadow-xl space-y-4">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-green-50 rounded-xl text-green-600 shadow-inner">
                    <Home className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-semibold">Bien Immobilier</h2>
            </div>

            <div className="pt-2 space-y-2">
                <Field label="Adresse du bien" value={data?.property_address} />
                <Field label="Montant du loyer" value={data?.rent_amount + " DZD"} />
                <Field label="Durée du bail" value={data?.rent_duration_months + " mois"} />
                <Field label="Mode de paiement" value={data?.payment_mode} />
            </div>
        </div>
    );
}
