
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import type { ResultData } from '../types';

interface ResultProps {
  data: ResultData;
  onReset: () => void;
  inputType: 'simple' | 'detailed';
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1943'];

const Result: React.FC<ResultProps> = ({ data, onReset, inputType }) => {
  const { inputs, advice } = data;

  const pieData = inputType === 'detailed' ? [
    { name: '住居費', value: inputs.detailed.housing },
    { name: '食費', value: inputs.detailed.food },
    { name: '水道光熱費', value: inputs.detailed.utilities },
    { name: '通信費', value: inputs.detailed.communication },
    { name: '保険料', value: inputs.detailed.insurance },
    { name: 'その他', value: inputs.detailed.other },
  ].filter(item => item.value > 0) : [];

  const savingsProjectionData = [
    { name: '現在', 貯蓄額: 0 },
    { name: '1年後', 貯蓄額: inputs.savings * 12 },
    { name: '5年後', 貯蓄額: inputs.savings * 12 * 5 },
    { name: '10年後', 貯蓄額: inputs.savings * 12 * 10 },
  ];
  
  const formatYAxis = (tickItem: number) => {
    if (tickItem >= 10000) {
      return `${tickItem / 10000}万円`;
    }
    return `${tickItem}円`;
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl mx-auto animate-fade-in">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">診断結果</h2>
      
      <div className="bg-sky-100 border-l-4 border-[#00aeef] text-sky-800 p-6 rounded-lg mb-8">
        <h3 className="text-xl font-semibold mb-2">ワンポイントアドバイス</h3>
        <p className="text-md">{advice}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 border rounded-lg">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">将来の貯蓄シミュレーション</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={savingsProjectionData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatYAxis} />
              <Tooltip formatter={(value: number) => `${value.toLocaleString()}円`} />
              <Legend />
              <Line type="monotone" dataKey="貯蓄額" stroke="#00aeef" strokeWidth={3} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {inputType === 'detailed' && pieData.length > 0 ? (
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">支出の内訳</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" label={(entry) => entry.name}>
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(value: number) => `${value.toLocaleString()}円`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="p-6 border rounded-lg flex flex-col items-center justify-center bg-gray-50">
             <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">支出の内訳</h3>
             <p className="text-gray-500">詳細入力を行うと、支出の円グラフが表示されます。</p>
          </div>
        )}
      </div>

      <div className="text-center mt-10">
        <button
          onClick={onReset}
          className="bg-[#00aeef] hover:bg-[#0095c7] text-white font-bold py-3 px-8 rounded-full focus:outline-none focus:shadow-outline"
        >
          もう一度診断する
        </button>
      </div>
    </div>
  );
};

export default Result;
