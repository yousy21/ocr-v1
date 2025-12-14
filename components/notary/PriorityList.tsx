import StatusBadge from "@/components/ui/StatusBadge";

const dossiers = [
    {
        id: "DL-001",
        locataire: "Omar Medjadj",
        bailleur: "Boualem Khelifa",
        status: "en_etude",
    },
    {
        id: "DL-002",
        locataire: "Amine Bouslimani",
        bailleur: "Youssef Benaissa",
        status: "signature",
    },
];

export default function PriorityList() {
    return (
        <section className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Priorité — Actes en attente</h3>

            <div className="space-y-4">
                {dossiers.map((d) => (
                    <div
                        key={d.id}
                        className="p-5 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium">{d.locataire} → {d.bailleur}</p>
                                <p className="text-sm text-gray-500">Contrat de Location • {d.id}</p>
                            </div>

                            <StatusBadge status={d.status} />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
