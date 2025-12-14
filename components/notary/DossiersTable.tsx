import StatusBadge from "@/components/ui/StatusBadge";

const rows = [
    {
        id: "DL-001",
        locataire: "Omar Medjadj",
        bailleur: "Boualem Khelifa",
        status: "en_etude",
        updated_at: "Aujourd’hui",
    },
    {
        id: "DL-002",
        locataire: "Amine Bouslimani",
        bailleur: "Youssef Benaissa",
        status: "signature",
        updated_at: "Hier",
    },
];

export default function DossiersTable() {
    return (
        <section className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Dossiers récents</h3>

            <table className="w-full">
                <thead>
                    <tr className="text-left text-gray-600 text-sm border-b">
                        <th className="pb-2">ID</th>
                        <th>Locataire</th>
                        <th>Bailleur</th>
                        <th>Statut</th>
                        <th>Dernière MAJ</th>
                    </tr>
                </thead>

                <tbody>
                    {rows.map((r) => (
                        <tr key={r.id} className="border-b hover:bg-gray-50">
                            <td className="py-3">{r.id}</td>
                            <td>{r.locataire}</td>
                            <td>{r.bailleur}</td>
                            <td>
                                <StatusBadge status={r.status} />
                            </td>
                            <td>{r.updated_at}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}
