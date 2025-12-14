"use client";

import { Search, Bell, UserCircle, Languages } from "lucide-react";

export default function Topbar() {
    return (
        <header className="bg-white rounded-2xl shadow-xl px-6 py-4 flex items-center justify-between">
            {/* Search */}
            <div className="relative w-80">
                <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Rechercher..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-100 border-none shadow-inner text-sm focus:outline-none"
                />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                <button className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 shadow-inner">
                    <Languages className="w-5 h-5 text-gray-600" />
                </button>

                <button className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 shadow-inner">
                    <Bell className="w-5 h-5 text-gray-600" />
                </button>

                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl shadow-inner cursor-pointer">
                    <UserCircle className="w-6 h-6 text-gray-600" />
                    <span className="text-sm text-gray-700">Notaire</span>
                </div>
            </div>
        </header>
    );
}
