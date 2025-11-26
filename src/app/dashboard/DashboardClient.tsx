"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

type Card = {
  id: number;
  title: string;
  company?: string;
  qr_url?: string;
};

export default function DashboardClient() {
  const router = useRouter();
  const [items, setItems] = useState<Card[]>([]);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("vcard_token");
    if (!token) { router.replace("/login"); return; }
    api.listCards().then((res) => setItems(res.items as Card[])).catch((err) => setNotice(err.message));
  }, [router]);

  async function createCard(e: React.FormEvent) {
    e.preventDefault();
    setNotice(null);
    try {
      await api.createCard({ title, company });
      const updated = await api.listCards();
      setItems(updated.items as Card[]);
      setTitle("");
      setCompany("");
      setNotice("Carte créée");
    } catch (err: unknown) {
      setNotice(err instanceof Error ? err.message : "Erreur inconnue");
    }
  }

  async function remove(id: number) {
    setNotice(null);
    try {
      await api.deleteCard(id);
      setItems(items.filter((c) => c.id !== id));
    } catch (err: unknown) {
      setNotice(err instanceof Error ? err.message : "Erreur inconnue");
    }
  }

  return (
    <main className="min-h-screen bg-white text-black p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Tableau de bord</h1>
        {notice && <div className="mb-3 text-sm text-neutral-300">{notice}</div>}
        <form onSubmit={createCard} className="flex gap-2 mb-6">
          <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Titre" className="flex-1 px-3 py-2 rounded-md border border-neutral-700" required />
          <input value={company} onChange={(e)=>setCompany(e.target.value)} placeholder="Entreprise" className="flex-1 px-3 py-2 rounded-md border border-neutral-700" />
          <button className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium">Créer</button>
        </form>
        <ul className="space-y-2">
          {items.map((c) => (
            <li key={c.id} className="flex items-center justify-between p-3 border border-neutral-800 rounded-md">
              <div className="flex items-center gap-3">
                {c.qr_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.qr_url} alt="QR" className="w-12 h-12 rounded-sm border border-neutral-700 bg-black" />
                )}
                <div className="font-medium">{c.title}</div>
                {c.company && <div className="text-sm text-neutral-400">{c.company}</div>}
              </div>
              <div className="flex gap-2">
                <a href={`/c/${c.id}`} className="text-sm px-3 py-1 border border-neutral-700 rounded-md">Voir</a>
                <a href={`/dashboard/${c.id}`} className="text-sm px-3 py-1 border border-neutral-700 rounded-md">Éditer</a>
                <button onClick={()=>remove(c.id)} className="text-sm px-3 py-1 border border-neutral-700 rounded-md">Supprimer</button>
                {c.qr_url && (
                  <a href={c.qr_url} download={`qr_${c.id}.png`} className="text-sm px-3 py-1 border border-neutral-700 rounded-md">Télécharger QR</a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
