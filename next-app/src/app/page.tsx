"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useBattle } from "./battle-context";

export default function EntryPage() {
  const router = useRouter();
  const { startBattle, reset, phase } = useBattle();
  const [urlA, setUrlA] = useState("");
  const [urlB, setUrlB] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedA = urlA.trim();
    const trimmedB = urlB.trim();

    if (!trimmedA || !trimmedB) {
      setError("URLを2件入力してください。");
      return;
    }

    const valid = [trimmedA, trimmedB].every((value) => value.startsWith("http"));
    if (!valid) {
      setError("httpから始まるURLを入力してください。");
      return;
    }

    if (trimmedA === trimmedB) {
      setError("別々のURLを入力してください。");
      return;
    }

    setError(null);
    startBattle({
      a: { url: trimmedA },
      b: { url: trimmedB },
    });
    router.push("/battling");
  };

  const handleReset = () => {
    setUrlA("");
    setUrlB("");
    setError(null);
    reset();
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <section className="space-y-4 text-center">
          <span className="rounded-full bg-slate-800/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
            Codex Hack
          </span>
          <h1 className="text-balance text-4xl font-semibold text-white md:text-5xl">
            飲み会の最終候補をAIで決めるバトルアリーナ
          </h1>
          <p className="text-sm text-slate-300 md:text-base">
            迷っているお店のURLを2件入力すると、AIがポケモンバトルさながらに勝敗を裁定します。
          </p>
        </section>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-2xl shadow-cyan-500/10 backdrop-blur"
        >
          <div className="space-y-2">
            <label htmlFor="urlA" className="text-sm font-medium text-slate-200">
              エントリーAのURL
            </label>
            <input
              id="urlA"
              value={urlA}
              onChange={(event) => setUrlA(event.target.value)}
              placeholder="https://restaurant.example.com/first-choice"
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-base text-white outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/30"
              type="url"
              inputMode="url"
              autoComplete="off"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="urlB" className="text-sm font-medium text-slate-200">
              エントリーBのURL
            </label>
            <input
              id="urlB"
              value={urlB}
              onChange={(event) => setUrlB(event.target.value)}
              placeholder="https://restaurant.example.com/second-choice"
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-base text-white outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/30"
              type="url"
              inputMode="url"
              autoComplete="off"
              required
            />
          </div>

          {error ? <p className="text-sm font-medium text-rose-400">{error}</p> : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white"
            >
              リセット
            </button>
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:from-cyan-400 hover:to-emerald-300"
            >
              {phase === "battling" ? "バトル中..." : "AIバトルを開始"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
