"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function RegisterClient() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.register({ name, email, password });
      router.push("/login");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <form onSubmit={submit} className="w-full max-w-sm p-6 border border-neutral-800 rounded-lg bg-neutral-900">
        <h1 className="text-2xl font-bold mb-4">Créer un compte</h1>
        {error && <div className="mb-3 text-red-400 text-sm">{error}</div>}
        <label className="block text-sm mb-2">Nom</label>
        <input value={name} onChange={(e)=>setName(e.target.value)} className="w-full mb-3 px-3 py-2 rounded-md bg-black border border-neutral-700" required />
        <label className="block text-sm mb-2">Email</label>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" className="w-full mb-3 px-3 py-2 rounded-md bg-black border border-neutral-700" required />
        <label className="block text-sm mb-2">Mot de passe</label>
        <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" className="w-full mb-4 px-3 py-2 rounded-md bg-black border border-neutral-700" required />
        <button disabled={loading} className="w-full px-4 py-2 bg-white text-black rounded-md text-sm font-medium">
          {loading ? "Création..." : "S’inscrire"}
        </button>
      </form>
    </main>
  );
}

