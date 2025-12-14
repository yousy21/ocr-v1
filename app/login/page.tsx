"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // If already logged in → redirect to dashboard
    useEffect(() => {
        (async () => {
            const { data } = await supabase.auth.getSession();
            if (data.session) {
                router.push("/notary/dashboard");
            }
        })();
    }, []);

    async function handleLogin(e: any) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);

        if (error) {
            setError("Email ou mot de passe incorrect.");
            return;
        }

        router.push("/notary/dashboard");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f7f7f8] p-6">
            <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl space-y-6">
                <h1 className="text-3xl font-bold text-center">Connexion</h1>
                <p className="text-center text-gray-500">
                    Accéder à l’espace notaire
                </p>

                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 rounded-xl bg-gray-100 shadow-inner"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Mot de passe"
                        className="w-full p-3 rounded-xl bg-gray-100 shadow-inner"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {error && (
                        <p className="text-red-600 text-sm text-center">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                    >
                        {loading ? (
                            <div className="flex justify-center">
                                <Loader2 className="animate-spin h-5 w-5" />
                            </div>
                        ) : (
                            "Se connecter"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
