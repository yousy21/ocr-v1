"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FileSignature,
    FolderOpen,
    Settings,
    User,
} from "lucide-react";

const menuItems = [
    {
        href: "/notary/dashboard",
        label: "Tableau de bord",
        icon: LayoutDashboard,
    },
    {
        href: "/notary/dossiers",
        label: "Dossiers",
        icon: FolderOpen,
    },
    {
        href: "/notary/actes",
        label: "Actes",
        icon: FileSignature,
    },
    {
        href: "/notary/settings",
        label: "Paramètres",
        icon: Settings,
    },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-white/80 backdrop-blur-xl shadow-xl rounded-r-3xl p-6 flex flex-col border border-white/20">
            <div className="text-2xl font-bold mb-10">
                <span className="text-blue-600">Dz</span>
                <span className="text-gray-700">notaire</span>
            </div>

            <nav className="flex-1 space-y-3">
                {menuItems.map((item) => {
                    const active = pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all shadow-sm
                ${active
                                    ? "bg-blue-100 text-blue-700 shadow-md"
                                    : "bg-white/60 text-gray-600 hover:shadow-md"
                                }
              `}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-6 flex items-center gap-3 px-4 py-2 rounded-xl bg-white/60 hover:shadow-md cursor-pointer text-gray-700">
                <User className="w-5 h-5" />
                <span>Mon profil</span>
            </div>
        </aside>
    );
}
