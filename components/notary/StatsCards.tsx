import { Clock, FileSignature, CheckCircle, FileCheck } from "lucide-react";

const stats = [
    {
        title: "Dossiers en attente",
        value: 4,
        icon: Clock,
        color: "bg-blue-50 text-blue-700",
    },
    {
        title: "Actes en cours",
        value: 12,
        icon: FileSignature,
        color: "bg-orange-50 text-orange-700",
    },
    {
        title: "Actes finalisés",
        value: 27,
        icon: CheckCircle,
        color: "bg-green-50 text-green-700",
    },
    {
        title: "Signatures en attente",
        value: 3,
        icon: FileCheck,
        color: "bg-purple-50 text-purple-700",
    },
];

export default function StatsCards() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((s) => (
                <div
                    key={s.title}
                    className={`p-6 rounded-2xl shadow-xl bg-white hover:shadow-2xl transition-all flex items-center gap-4`}
                >
                    <div className={`p-4 rounded-xl ${s.color} shadow-inner`}>
                        <s.icon className="w-7 h-7" />
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">{s.title}</p>
                        <h2 className="text-3xl font-bold">{s.value}</h2>
                    </div>
                </div>
            ))}
        </div>
    );
}
