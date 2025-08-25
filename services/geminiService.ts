import { GoogleGenAI } from "@google/genai";
import type { InputData } from '../types';

const getApiKey = (): string => {
  const apiKey = import.meta.env.VITE_API_KEY;
  if (!apiKey) {
    throw new Error("VITE_API_KEY environment variable not set.");
  }
  return apiKey;
};

// apiKeyの初期化に失敗する可能性を考慮し、try-catchで囲みます。
let ai: GoogleGenAI;
try {
  ai = new GoogleGenAI({ apiKey: getApiKey() });
} catch (error) {
  console.error("Failed to initialize GoogleGenAI:", error);
  // aiが初期化できなかった場合でも、アプリケーションがクラッシュしないようにする
}


const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('ja-JP').format(num);
};

export const getFinancialAdvice = async (data: InputData, inputType: 'simple' | 'detailed') => {
  if (!ai) {
    throw new Error("AIサービスが初期化されていません。APIキーの設定を確認してください。");
  }

  const { maritalStatus, childrenCount, income, expenses, savings, detailed } = data;

  let prompt =  `# 指示
あなたは優秀なファイナンシャル・プランナーです。
ユーザーから提供された家計データと家族状況を分析し、具体的で実行可能なアドバイスを提案してください。

# タスク
以下の2つの具体的なアクションを提案してください。
1. 明日からすぐに始められる簡単な節約術や改善案
2. 中長期的な視点で取り組むべき資産形成や家計改善のアイデア

# 制約
- 必ず箇条書き（「・」を使用）で記述してください。
- 各項目は100文字程度にまとめてください。
- 全体で300文字以内に収めてください。
- AIが生成したような不自然な記号（*や#など）は絶対に使用しないでください。
- ユーザーへの呼びかけ（「〇〇さん」など）は不要です。

ユーザーの家族状況:
- 婚姻状況: ${maritalStatus === 'married' ? '既婚' : '独身'}
- お子様の人数: ${childrenCount}人

ユーザーの家計状況:
- 毎月の手取り収入: ${formatNumber(income)}円
- 毎月の支出合計: ${formatNumber(expenses)}円
- 毎月の貯金額: ${formatNumber(savings)}円
`;

  if (inputType === 'detailed') {
    prompt += `
支出の内訳:
- 住居費: ${formatNumber(detailed.housing)}円
- 食費: ${formatNumber(detailed.food)}円
- 水道光熱費: ${formatNumber(detailed.utilities)}円
- 通信費: ${formatNumber(detailed.communication)}円
- 保険料: ${formatNumber(detailed.insurance)}円
- その他: ${formatNumber(detailed.other)}円
`;
  }

  prompt += "\n上記の情報に基づいて、具体的で実行可能なアドバイスをお願いします。";

  // 環境変数からモデル名を取得し、設定がなければデフォルトのモデルを使用する
  const modelName = import.meta.env.VITE_GEMINI_MODEL_NAME || 'gemini-2.5-flash';

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });
    
    if (!response.text) {
        throw new Error("AIからの応答が空です。");
    }
    return response.text;
  } catch (error) {
    console.error("Error generating financial advice:", error);
    // エラーを呼び出し元にスローして、UIでエラーメッセージを表示できるようにします。
    throw new Error("AIによるアドバイスの生成中にエラーが発生しました。しばらくしてからもう一度お試しください。");
  }
};
