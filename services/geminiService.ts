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

  let prompt = ` あなたは、経験豊富で非常に親しみやすいファイナンシャル・アドバイザーです。ユーザーの家計データに基づき、ワンポイントアドバイスを自然な日本語で生成してください。不安を煽るのではなく、ユーザーが「素敵な未来のために、やってみよう」と思えるような、優しく寄り添う表現を心がけてください。
未来が明るくなるような声がけをしてください。そして、明日から始められる簡単な第一歩を提案し、最終目標までの道のりを、達成イメージとともに示してあげてください。全体の文字数は200－300文字が理想。長くなりそうなときは箇条書きで書くなど工夫してください。

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

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
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
