"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useBattle } from "../battle-context";

export default function BattlingPage() {
  const router = useRouter();
  const { contenders, resolveBattle } = useBattle();
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (!contenders) {
      router.replace("/");
      return;
    }

    if (hasTriggeredRef.current) {
      return;
    }

    hasTriggeredRef.current = true;

    const runBattle = async () => {
      try {
        const response = await fetch("/api/battle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contenderA: contenders.a.url,
            contenderB: contenders.b.url,
          }),
        });

        if (!response.ok) {
          throw new Error("AIの評価に失敗しました。");
        }

        const data = await response.json();
        resolveBattle(data);
        router.replace("/result");
      } catch (error) {
        console.error(error);
        router.replace("/?error=battle");
      }
    };

    runBattle();
  }, [contenders, resolveBattle, router]);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-6 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_50%),radial-gradient(circle_at_bottom,_rgba(52,211,153,0.2),_transparent_55%)]" />

      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-12">
        <header className="text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-cyan-200/80">Battling</p>
          <h1 className="text-balance text-4xl font-semibold text-white md:text-5xl">
            AIが2つのお店を徹底ジャッジ中・・・
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-sm text-slate-300 md:text-base">
            ポケモンバトル風の演出でAIが戦況を解析中です。しばらくお待ちください。
          </p>
        </header>

        <div className="relative w-full max-w-4xl rounded-3xl border border-white/10 bg-slate-900/60 p-10 shadow-[0_0_80px_rgba(16,185,129,0.25)] backdrop-blur">
          <div className="absolute inset-x-12 top-1/2 -translate-y-1/2 border-t border-dashed border-white/25" />

          <div className="relative z-10 grid gap-8 md:grid-cols-2">
            <BattleSide
              label="エントリーA"
              url={contenders?.a.url ?? ""}
              gradient="from-cyan-400 via-sky-500 to-blue-600"
              position="left"
              imageSrc="/baby1.png"
            />
            <BattleSide
              label="エントリーB"
              url={contenders?.b.url ?? ""}
              gradient="from-emerald-400 via-emerald-500 to-teal-600"
              position="right"
              imageSrc="/baby2.png"
            />
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-10 flex justify-center">
            <div className="relative">
              <span className="absolute -inset-10 rounded-full bg-cyan-400/30 blur-3xl"></span>
              <span className="absolute inset-0 animate-ping rounded-full border border-cyan-300/40" />
              <span className="relative flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-emerald-500 text-lg font-semibold text-slate-950 shadow-lg shadow-cyan-500/50">
                VS
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3 text-sm text-slate-200">
          <span className="relative flex size-3">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex size-full rounded-full bg-emerald-500"></span>
          </span>
          AIの判定結果がまとまり次第、自動的に結果画面へ遷移します。
        </div>
      </div>
    </main>
  );
}

type BattleSideProps = {
  label: string;
  url: string;
  gradient: string;
  position: "left" | "right";
  imageSrc: string;
};

function BattleSide({ label, url, gradient, position, imageSrc }: BattleSideProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60 p-8 shadow-inner shadow-black/40">
      <div className={`pointer-events-none absolute -top-20 ${position === "left" ? "-left-14" : "-right-14"}`}>
        <div
          className={`size-56 animate-float rounded-full bg-gradient-to-br ${gradient} opacity-80 blur-sm`}
        />
      </div>
      <div className="relative z-10 space-y-5">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">{label}</p>
        <div className="flex items-center gap-4">
          <div className="relative flex size-40 items-center justify-center">
            <span className="absolute inset-2 rounded-full bg-slate-900/80" />
            <span className="absolute inset-0 animate-battle-ring rounded-full border-2 border-cyan-300/50" />
            <span
              className={`absolute inset-0 animate-battle-glow rounded-full bg-gradient-to-tr ${gradient} opacity-50 blur lg:opacity-60`}
            />
            <span className="relative flex size-32 items-center justify-center overflow-hidden rounded-full bg-slate-950/90">
              <Image src={imageSrc} alt={label} width={128} height={128} className="size-32 object-contain" priority />
            </span>
          </div>
          <p className="flex-1 break-words text-sm text-slate-200">
            {url || "URL未設定"}
          </p>
        </div>
      </div>
    </div>
  );
}
