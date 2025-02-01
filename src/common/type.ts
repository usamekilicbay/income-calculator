export type TColumns = {
  hourly: boolean;
  daily: boolean;
  weekly: boolean;
  montly: boolean;
  annually: boolean;
};

export type TFormula = {
  hours: number;
  days: number;
  annualLeave: number;
};

export type TMoney = {
  amount: number;
} & TCurrency;

export type TCurrency = {
  name: string;
  abbr: string;
};

export type TNumberInputState = "empty" | "big" | "small" | "valid";
