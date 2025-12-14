"use client";

import { supabase } from "@/lib/supabaseClient";

export default function TestSupabase() {
    async function check() {
        const { data, error } = await supabase.from("dossiers").select("*").limit(1);

        console.log("DATA:", data);
        console.log("ERROR:", error);
    }

    return (
        <div className="p-6">
            <button
                onClick={check}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow"
            >
                Test Supabase
            </button>
        </div>
    );
}
