
import React, { useState, useRef } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import Result from './components/Result';
import { getFinancialAdvice } from './services/geminiService';
import type { InputData, ResultData } from './types';

const App: React.FC = () => {
  const [result, setResult] = useState<ResultData | null>(null);
  const [inputType, setInputType] = useState<'simple' | 'detailed'>('simple');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const formRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleStart = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDiagnose = async (data: InputData, type: 'simple' | 'detailed') => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setInputType(type);

    try {
      const advice = await getFinancialAdvice(data, type);
      setResult({ advice, inputs: data });
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('診断中に予期せぬエラーが発生しました。');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Header />
      <main className="container mx-auto px-6 py-8 md:py-12">
        {!result && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#00aeef] mb-4">
              1分でわかる！
            </h2>
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 mb-6">
              未来の家計シミュレーション
            </h1>
            <p className="max-w-3xl mx-auto text-gray-600 text-lg mb-8">
              簡単な質問に答えるだけで、あなたの家計の現状を分析し、将来の資産推移をシミュレーションします。漠然としたお金の不安を解消し、未来への一歩を踏み出しましょう。
            </p>
            <button
              onClick={handleStart}
              className="bg-[#00aeef] hover:bg-[#0095c7] text-white font-bold py-4 px-10 rounded-full text-lg transition duration-300 transform hover:scale-105"
            >
              診断をはじめる
            </button>
          </div>
        )}

        <div ref={formRef} className="mb-12">
          {!result && <InputForm onDiagnose={handleDiagnose} isLoading={isLoading} />}
        </div>
        
        {isLoading && !result && (
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#00aeef]"></div>
                <p className="text-gray-600 mt-4">AIが診断中です。少々お待ちください...</p>
            </div>
        )}

        {error && <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>}

        <div ref={resultRef}>
          {result && <Result data={result} onReset={handleReset} inputType={inputType} />}
        </div>
      </main>
      
      <footer className="text-center py-6 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} T.knot. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
