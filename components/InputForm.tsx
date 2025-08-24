
import React, { useState, useEffect, useCallback } from 'react';
import type { InputData } from '../types';

interface InputFormProps {
  onDiagnose: (data: InputData, inputType: 'simple' | 'detailed') => void;
  isLoading: boolean;
}

type InputMode = 'simple' | 'detailed';
type MaritalStatus = 'single' | 'married';

const InputForm: React.FC<InputFormProps> = ({ onDiagnose, isLoading }) => {
  const [mode, setMode] = useState<InputMode>('simple');
  
  // Family status
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus>('single');
  const [childrenCount, setChildrenCount] = useState<string>('');

  // Income & Expenses
  const [income, setIncome] = useState<string>('');
  const [simpleExpenses, setSimpleExpenses] = useState<string>('');
  const [savings, setSavings] = useState<string>('');
  
  const [housing, setHousing] = useState<string>('');
  const [food, setFood] = useState<string>('');
  const [utilities, setUtilities] = useState<string>('');
  const [communication, setCommunication] = useState<string>('');
  const [insurance, setInsurance] = useState<string>('');
  const [other, setOther] = useState<string>('');

  const [totalDetailedExpenses, setTotalDetailedExpenses] = useState<number>(0);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  const parseNumber = (str: string) => parseInt(str, 10) || 0;

  useEffect(() => {
    const incomeNum = parseNumber(income);
    const expensesNum = parseNumber(simpleExpenses);
    if (mode === 'simple' && incomeNum > 0 && expensesNum > 0 && incomeNum >= expensesNum) {
      setSavings((incomeNum - expensesNum).toString());
    } else {
      setSavings('');
    }
  }, [income, simpleExpenses, mode]);
  
  const calculateTotalDetailedExpenses = useCallback(() => {
    const total = [housing, food, utilities, communication, insurance, other].reduce((acc, val) => acc + parseNumber(val), 0);
    setTotalDetailedExpenses(total);
  }, [housing, food, utilities, communication, insurance, other]);

  useEffect(() => {
    if (mode === 'detailed') {
      calculateTotalDetailedExpenses();
    }
  }, [mode, calculateTotalDetailedExpenses]);
  
  useEffect(() => {
    const incomeNum = parseNumber(income);
    if (mode === 'simple') {
      const expensesNum = parseNumber(simpleExpenses);
      setIsFormValid(incomeNum > 0 && expensesNum > 0 && incomeNum >= expensesNum);
    } else {
       setIsFormValid(incomeNum > 0 && totalDetailedExpenses > 0 && incomeNum >= totalDetailedExpenses);
    }
  }, [income, simpleExpenses, totalDetailedExpenses, mode]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const incomeNum = parseNumber(income);
    let expensesNum = 0;
    let savingsNum = 0;

    if (mode === 'simple') {
        expensesNum = parseNumber(simpleExpenses);
        savingsNum = incomeNum - expensesNum;
    } else {
        expensesNum = totalDetailedExpenses;
        savingsNum = incomeNum - expensesNum;
    }

    const data: InputData = {
      maritalStatus: maritalStatus,
      childrenCount: parseNumber(childrenCount),
      income: incomeNum,
      expenses: expensesNum,
      savings: savingsNum,
      detailed: {
        housing: parseNumber(housing),
        food: parseNumber(food),
        utilities: parseNumber(utilities),
        communication: parseNumber(communication),
        insurance: parseNumber(insurance),
        other: parseNumber(other),
      }
    };
    onDiagnose(data, mode);
  };
  
  const renderInputField = (label: string, value: string, setValue: (val: string) => void, placeholder = "例: 100000") => (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={label}>
        {label}
      </label>
      <input
        id={label}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-[#00aeef]"
        type="number"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        min="0"
      />
    </div>
  );

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-6">
          <button
            onClick={() => setMode('simple')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${mode === 'simple' ? 'border-[#00aeef] text-[#00aeef]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            かんたん入力
          </button>
          <button
            onClick={() => setMode('detailed')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${mode === 'detailed' ? 'border-[#00aeef] text-[#00aeef]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            詳細入力
          </button>
        </nav>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
           <h3 className="text-lg font-semibold text-gray-800 mb-3">家族構成</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">婚姻状況</label>
                <div className="flex space-x-4">
                   <label className="flex items-center">
                     <input type="radio" name="maritalStatus" value="single" checked={maritalStatus === 'single'} onChange={() => setMaritalStatus('single')} className="form-radio h-4 w-4 text-[#00aeef] focus:ring-[#00aeef]"/>
                     <span className="ml-2 text-gray-700">独身</span>
                   </label>
                   <label className="flex items-center">
                     <input type="radio" name="maritalStatus" value="married" checked={maritalStatus === 'married'} onChange={() => setMaritalStatus('married')} className="form-radio h-4 w-4 text-[#00aeef] focus:ring-[#00aeef]"/>
                     <span className="ml-2 text-gray-700">既婚</span>
                   </label>
                </div>
              </div>
              {renderInputField('お子様の人数 (人)', childrenCount, setChildrenCount, "例: 2")}
           </div>
        </div>

        {renderInputField('毎月の手取り収入 (円)', income, setIncome)}
        
        {mode === 'simple' && (
          <>
            {renderInputField('毎月の支出合計 (円)', simpleExpenses, setSimpleExpenses)}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                毎月の貯金額 (円)
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100"
                type="text"
                value={savings ? `${parseInt(savings, 10).toLocaleString()} 円` : '自動計算'}
                readOnly
              />
            </div>
          </>
        )}
        
        {mode === 'detailed' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderInputField('住居費 (円)', housing, setHousing)}
            {renderInputField('食費 (円)', food, setFood)}
            {renderInputField('水道光熱費 (円)', utilities, setUtilities)}
            {renderInputField('通信費 (円)', communication, setCommunication)}
            {renderInputField('保険料 (円)', insurance, setInsurance)}
            {renderInputField('その他 (円)', other, setOther)}
             <div className="md:col-span-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                毎月の支出合計 / 貯金額 (円)
              </label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100">
                <p>支出合計: {totalDetailedExpenses.toLocaleString()} 円</p>
                <p>貯金額: {(parseNumber(income) - totalDetailedExpenses).toLocaleString()} 円</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-center mt-6">
          <button
            className="bg-[#00aeef] hover:bg-[#0095c7] text-white font-bold py-3 px-8 rounded-full focus:outline-none focus:shadow-outline disabled:bg-gray-400 disabled:cursor-not-allowed"
            type="submit"
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? '診断中...' : '診断する'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputForm;
