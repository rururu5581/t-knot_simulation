
export interface SimpleInput {
  maritalStatus: 'single' | 'married';
  childrenCount: number;
  income: number;
  expenses: number;
  savings: number;
}

export interface DetailedInput {
  housing: number;
  food: number;
  utilities: number;
  communication: number;
  insurance: number;
  other: number;
}

export type InputData = SimpleInput & {
  detailed: DetailedInput;
};

export interface ResultData {
  advice: string;
  inputs: InputData;
}
