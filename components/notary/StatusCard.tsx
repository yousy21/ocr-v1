import { FileCheck2, Clock } from "lucide-react";

export default function StatusCard({ dossier }: { dossier: any }) {
    return (
        <div className="p-6 bg-white rounded-2xl shadow-xl space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
                <FileCheck2 className="text-purple-600" /> Informations dossier
            </h2>

            <div className="space-y-2 text-sm">
                <p>
                    <span className="text-gray-500">Type:</span>{" "}
                    <span className="font-medium capitalize">
                        {dossier.type.replace("_", " ")}
                    </span>
                </p>

                <p>
                    <span className="text-gray-500">Statut:</span>{" "}
                    <span className="font-semibold text-blue-600">
                        {dossier.status}
                    </span>
                </p>

                <p>
                    <span className="text-gray-500">Créé le:</span>{" "}
                    <span className="font-medium">
                        {new Date(dossier.created_at).toLocaleDateString("fr-FR")}
                    </span>
                </p>
            </div>
        </div>
    );
}
