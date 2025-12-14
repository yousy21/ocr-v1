"use client";

import Link from "next/link";
import StatusBadge from "@/components/ui/StatusBadge";
import { FileSignature } from "lucide-react";

export default function DossierCard({ dossier }: any) {
    return (
        <div className="p-6 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all space-y-4">

            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 text-blue-700 rounded-xl shadow-inner">
                    <FileSignature className="w-6 h-6" />
                </div>

                <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-semibold capitalize">
                        {dossier.type.replace("_", " ")}
                    </p>
                </div>
            </div>

            {/* Status */}
            <div>
                <StatusBadge status={dossier.status} />
            </div>

            {/* Link */}
            <div className="flex justify-end">
                <Link
                    href={`/notary/dossiers/${dossier.id}`}
                    className="text-blue-600 text-sm font-medium hover:underline"
                >
                    Ouvrir →
                </Link>
            </div>

            <p className="text-xs text-gray-400 text-right">
                {new Date(dossier.created_at).toLocaleDateString("fr-FR")}
            </p>
        </div>
    );
}
