"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useBattle } from "../battle-context";

export default function ResultPage() {
  const router = useRouter();
  const { result, contenders, reset } = useBattle();

  useEffect(() => {
    if (!result || !contenders) {
      router.replace("/");
    }
  }, [contenders, result, router]);

  const shopOrder = useMemo(() => {
    if (!result || !contenders) {
      return [] as Array<{
        label: string;
        imageSrc: string;
        info: { name: string; markdown: string };
        url: string;
      }>;
    }

    return result.winner === "A"
      ? [
          { label: "エントリーA", imageSrc: "/baby1.png", info: result.shopDetails.A, url: contenders.a.url },
          { label: "エントリーB", imageSrc: "/baby2.png", info: result.shopDetails.B, url: contenders.b.url },
        ]
      : [
          { label: "エントリーB", imageSrc: "/baby2.png", info: result.shopDetails.B, url: contenders.b.url },
          { label: "エントリーA", imageSrc: "/baby1.png", info: result.shopDetails.A, url: contenders.a.url },
        ];
  }, [contenders, result]);

  if (!result || !contenders) {
    return null;
  }

  const winnerLabel = result.winner === "A" ? "エントリーA" : "エントリーB";
  const runnerUpLabel = result.winner === "A" ? "エントリーB" : "エントリーA";
  const winningUrl = result.winner === "A" ? contenders.a.url : contenders.b.url;
  const losingUrl = result.winner === "A" ? contenders.b.url : contenders.a.url;
  const winnerImageSrc = result.winner === "A" ? "/baby1.png" : "/baby2.png";
  const runnerUpImageSrc = result.winner === "A" ? "/baby2.png" : "/baby1.png";
  const winnerInfo = result.shopDetails[result.winner];
  const runnerUpInfo = result.shopDetails[result.winner === "A" ? "B" : "A"];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <header className="space-y-4 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Result</p>
          <h1 className="text-balance text-4xl font-semibold text-white md:text-5xl">
            勝者は <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">{winnerLabel}</span>！
          </h1>
          <p className="text-pretty text-sm text-slate-300 md:text-base">
            AIは下記の観点から総合評価を行いました。勝敗の理由を確認し、幹事の最終決定に活かしましょう。
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-emerald-400/50 bg-emerald-500/10 p-6 shadow-lg shadow-emerald-400/20">
            <p className="text-xs font-semibold uppercase text-emerald-300">WINNER</p>
            <div className="mt-3 flex items-start gap-4">
              <Avatar imageSrc={winnerImageSrc} label={`${winnerLabel}イメージ`} />
              <div className="space-y-1">
                <h2 className="text-base font-semibold text-white">{winnerInfo.name}</h2>
                <p className="text-xs text-emerald-100/80">{winningUrl}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-emerald-100/90">{result.summary}</p>
          </div>

          <div className="rounded-3xl border border-slate-700 bg-slate-900/70 p-6">
            <p className="text-xs font-semibold uppercase text-slate-400">RUNNER-UP</p>
            <div className="mt-3 flex items-start gap-4">
              <Avatar imageSrc={runnerUpImageSrc} label={`${runnerUpLabel}イメージ`} />
              <div className="space-y-1">
                <h2 className="text-base font-semibold text-slate-200">{runnerUpInfo.name}</h2>
                <p className="text-xs text-slate-400">{losingUrl}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-400">敗因の詳細は評価項目で確認してください。</p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-white">評価項目</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {result.evaluations.map((evaluation) => {
              const isWinnerA = evaluation.winner === "A";
              const highlightClass = isWinnerA
                ? "border-cyan-400/50 bg-cyan-500/10"
                : "border-emerald-400/40 bg-emerald-500/10";

              return (
                <article
                  key={evaluation.category}
                  className={`rounded-2xl border ${highlightClass} p-5 shadow-inner shadow-black/40`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold uppercase">
                    <span className="tracking-[0.2em] text-slate-300">{evaluation.category}</span>
                    <span className={`${isWinnerA ? "text-cyan-300" : "text-emerald-300"}`}>
                      {evaluation.winner === "A" ? "エントリーA" : "エントリーB"} が有利
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-200">{evaluation.reason}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-white">店舗詳細</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {shopOrder.map((shop) => (
              <ShopInfoToggle
                key={shop.label}
                label={shop.label}
                name={shop.info.name}
                url={shop.url}
                imageSrc={shop.imageSrc}
                markdown={shop.info.markdown}
              />
            ))}
          </div>
        </section>

        <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-slate-900/60 px-6 py-8 md:flex-row md:justify-between">
          <div className="space-y-1 text-center md:text-left">
            <p className="text-sm font-semibold text-white">もう一度バトルしますか？</p>
            <p className="text-xs text-slate-400">URLを差し替えて、再戦させましょう。</p>
          </div>
          <Link
            href="/"
            onClick={() => reset()}
            className="rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:from-cyan-400 hover:to-emerald-300"
          >
            新しいバトルを始める
          </Link>
        </div>
      </div>
    </main>
  );
}

type AvatarProps = {
  imageSrc: string;
  label: string;
};

function Avatar({ imageSrc, label }: AvatarProps) {
  return (
    <div className="relative flex size-24 items-center justify-center overflow-hidden rounded-full bg-slate-950/80">
      <Image src={imageSrc} alt={label} width={128} height={128} className="size-24 object-contain" />
    </div>
  );
}

type ShopInfoToggleProps = {
  label: string;
  name: string;
  url: string;
  imageSrc: string;
  markdown: string;
};

function ShopInfoToggle({ label, name, url, imageSrc, markdown }: ShopInfoToggleProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-inner shadow-black/40">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-4 text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-4">
          <Avatar imageSrc={imageSrc} label={`${label} アバター`} />
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">{label}</p>
            <p className="text-sm font-semibold text-white">{name}</p>
            <p className="text-xs text-slate-400">{url}</p>
          </div>
        </div>
        <span className="text-cyan-300">{open ? "閉じる" : "開く"}</span>
      </button>
      {open ? (
        <div className="mt-5 max-h-80 overflow-y-auto rounded-2xl border border-slate-800/80 bg-slate-950/70 p-4 text-sm leading-6 text-slate-200">
          <pre className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-200">{markdown}</pre>
        </div>
      ) : null}
    </div>
  );
}
