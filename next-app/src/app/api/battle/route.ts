import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import type { BattleResult } from "../../battle-context";

const MOCK_BASE_PATH = path.join(process.cwd(), "mock");
const RESULT_PATH = path.join(MOCK_BASE_PATH, "result", "result.json");
const SHOP_INFO_A_PATH = path.join(MOCK_BASE_PATH, "info", "shop1.md");
const SHOP_INFO_B_PATH = path.join(MOCK_BASE_PATH, "info", "shop2.md");

type BattlePayload = {
  contenderA?: string;
  contenderB?: string;
};

type RawResult = {
  results: Array<{
    genre: string;
    winner: 1 | 2;
    reason: string;
  }>;
  winner: 1 | 2;
};

async function loadShopInfo(filePath: string) {
  const markdown = await fs.readFile(filePath, "utf-8");
  const headingMatch = markdown.match(/^#\s*(.+)$/m);
  const name = headingMatch ? headingMatch[1].trim() : "店舗情報";
  return { name, markdown };
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as BattlePayload;
  const { contenderA, contenderB } = body;

  if (!contenderA || !contenderB) {
    return NextResponse.json({ message: "2つのURLが必要です" }, { status: 400 });
  }

  await new Promise((resolve) => setTimeout(resolve, 2400));

  const [rawJson, shopA, shopB] = await Promise.all([
    fs.readFile(RESULT_PATH, "utf-8"),
    loadShopInfo(SHOP_INFO_A_PATH),
    loadShopInfo(SHOP_INFO_B_PATH),
  ]);

  const parsed = JSON.parse(rawJson) as RawResult;

  const evaluations = parsed.results.map((item) => ({
    category: item.genre,
    winner: item.winner === 1 ? "A" : "B",
    reason: item.reason,
  }));

  const overallWinner = parsed.winner === 1 ? "A" : "B";
  const highlightReason = evaluations.find((item) => item.winner === overallWinner)?.reason;

  const summary = highlightReason
    ? highlightReason
    : overallWinner === "A"
      ? "エントリーAが僅差で勝利しました。"
      : "エントリーBが僅差で勝利しました。";

  const result: BattleResult = {
    winner: overallWinner,
    summary,
    evaluations,
    shopDetails: {
      A: shopA,
      B: shopB,
    },
  };

  return NextResponse.json(result);
}
