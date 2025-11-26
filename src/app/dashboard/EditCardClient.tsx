"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { api, API_BASE } from "@/lib/api";

export default function EditCardClient() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const [form, setForm] = useState<Record<string, string>>({ title: "", company: "", email: "", phone: "", website: "", address: "" });
  const [photo, setPhoto] = useState<string>("");
  const [qrUrl, setQrUrl] = useState<string>("");
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("vcard_token");
    if (!token) { router.replace("/login"); return; }
    fetch(`${API_BASE}/api/cards.php?id=${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r)=>r.json())
      .then((d)=>{
        const item = d.item;
        setForm({ title: item.title || "", company: item.company || "", email: item.email || "", phone: item.phone || "", website: item.website || "", address: item.address || "" });
        setPhoto(item.photo_url || "");
        setQrUrl(item.qr_url || "");
      })
      .catch((e)=>setNotice(e.message));
  }, [id, router]);

  async function uploadFile(f: File) {
    const token = localStorage.getItem("vcard_token")!;
    const fd = new FormData();
    fd.append("file", f);
    const res = await fetch(`${API_BASE}/api/upload.php`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.url as string;
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setNotice(null);
    try {
      await api.updateCard(id, { ...form, photo_url: photo });
      setNotice("Enregistré");
    } catch (err: unknown) {
      setNotice(err instanceof Error ? err.message : "Erreur inconnue");
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Éditer la carte</h1>
        {notice && <div className="mb-3 text-sm text-neutral-300">{notice}</div>}
        <form onSubmit={save} className="space-y-3">
          <input value={form.title} onChange={(e)=>setForm({ ...form, title: e.target.value })} placeholder="Titre" className="w-full px-3 py-2 rounded-md bg-neutral-900 border border-neutral-700" required />
          <input value={form.company} onChange={(e)=>setForm({ ...form, company: e.target.value })} placeholder="Entreprise" className="w-full px-3 py-2 rounded-md bg-neutral-900 border border-neutral-700" />
          <input value={form.email} onChange={(e)=>setForm({ ...form, email: e.target.value })} placeholder="Email" className="w-full px-3 py-2 rounded-md bg-neutral-900 border border-neutral-700" />
          <input value={form.phone} onChange={(e)=>setForm({ ...form, phone: e.target.value })} placeholder="Téléphone" className="w-full px-3 py-2 rounded-md bg-neutral-900 border border-neutral-700" />
          <input value={form.website} onChange={(e)=>setForm({ ...form, website: e.target.value })} placeholder="Site web" className="w-full px-3 py-2 rounded-md bg-neutral-900 border border-neutral-700" />
          <input value={form.address} onChange={(e)=>setForm({ ...form, address: e.target.value })} placeholder="Adresse" className="w-full px-3 py-2 rounded-md bg-neutral-900 border border-neutral-700" />
          <div className="flex items-center gap-3">
            {photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt="photo" className="w-16 h-16 rounded-full object-cover" />
            )}
            <input type="file" accept="image/*" onChange={async (e)=>{
              const f = e.target.files?.[0];
              if (f) {
                const url = await uploadFile(f);
                setPhoto(url);
              }
            }} />
          </div>
          <button className="px-4 py-2 bg-white text-black rounded-md text-sm font-medium">Enregistrer</button>
        </form>
        <div className="mt-4 text-sm text-neutral-400">Lien public: <a href={`/c/${id}`} className="underline">/c/{id}</a></div>
        {qrUrl && (
          <div className="mt-4 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrUrl} alt="QR code" className="w-24 h-24 border border-neutral-700 rounded-sm bg-black" />
            <a href={qrUrl} download={`qr_${id}.png`} className="px-3 py-2 border border-neutral-700 rounded-md text-sm">Télécharger QR</a>
          </div>
        )}
      </div>
    </main>
  );
}
