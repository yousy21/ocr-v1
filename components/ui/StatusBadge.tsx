export default function StatusBadge({ status }: { status: string }) {
    const variants: any = {
        reception: "bg-yellow-100 text-yellow-700",
        en_etude: "bg-blue-100 text-blue-700",
        projet: "bg-orange-100 text-orange-700",
        signature: "bg-purple-100 text-purple-700",
        termine: "bg-green-100 text-green-700",
    };

    const label: any = {
        reception: "Réception",
        en_etude: "En étude",
        projet: "Projet",
        signature: "Signature",
        termine: "Terminé",
    };

    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${variants[status] || "bg-gray-100 text-gray-600"
                }`}
        >
            {label[status] || status}
        </span>
    );
}
