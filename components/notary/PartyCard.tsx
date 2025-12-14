import Field from "@/components/ui/Field";
import { User, BadgeCheck } from "lucide-react";

export default function PartyCard({
    title,
    icon,
    data,
}: {
    title: string;
    icon: React.ReactNode;
    data: any;
}) {
    return (
        <div className="p-6 bg-white rounded-2xl shadow-xl space-y-4">
            {/* Title */}
            <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600 shadow-inner">
                    {icon}
                </div>
                <h2 className="text-xl font-semibold">{title}</h2>
            </div>

            <div className="pt-2 space-y-2">
                <Field label="Nom complet" value={data?.nom} />
                <Field label="prenom complet" value={data?.prenom} />
                <Field label="N° d'identité" value={data?.cin} />
                <Field label="Date de naissance" value={data?.date_naissance} />
                <Field label="Lieu de naissance" value={data?.lieu_naissance} />
                <Field label="Adresse" value={data?.address} />
            </div>
        </div>
    );
}
