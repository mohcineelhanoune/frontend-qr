import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-xl p-8 border border-neutral-800 rounded-lg bg-neutral-900">
        <h1 className="text-3xl font-bold mb-2">Digital Business Card Builder</h1>
        <p className="text-neutral-400 mb-6">
          Créez et partagez vos cartes digitales. Multi-utilisateur, simple et rapide.
        </p>
        <div className="flex gap-3">
          <Link href="/login" className="px-4 py-2 bg-white text-black rounded-md text-sm font-medium">Se connecter</Link>
          <Link href="/dashboard" className="px-4 py-2 border border-neutral-700 rounded-md text-sm">Tableau de bord</Link>
        </div>
      </div>
    </main>
  );
}
