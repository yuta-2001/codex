import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { BattleProvider } from "./battle-context";

const notoSansJp = Noto_Sans_JP({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata: Metadata = {
  title: "Codex Hack",
  description: "飲み会の幹事がAIに最終候補を判断してもらうモックアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJp.className} bg-slate-950 text-slate-50`}> 
        <BattleProvider>{children}</BattleProvider>
      </body>
    </html>
  );
}
