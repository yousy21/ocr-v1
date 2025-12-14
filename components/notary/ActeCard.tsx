"use client";

import Link from "next/link";

export default function ActeCard({ acte }: any) {
    return (
        <Link
            href={acte.link}
            className="p-6 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all block"
        >
            <div className="text-5xl mb-4">{acte.icon}</div>

            <h2 className="text-xl font-semibold">{acte.title}</h2>
            <p className="text-gray-500 mt-2 text-sm">{acte.description}</p>

            <p className="mt-4 text-blue-600 font-medium hover:underline">
                Créer →
            </p>
        </Link>
    );
}
