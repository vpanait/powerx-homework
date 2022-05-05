export const TYPE = {
  VOLTAGE: "Voltage",
  CURRENT: "Current",
};

export enum Type {
  Voltage = "Voltage",
  Current = "Current",
}

export interface Reading {
  ts: number;
  type: Type.Voltage | Type.Current;
  value: number;
}

export class CustomError {
  message!: string;
  status!: number;
  additionalInfo!: any;

  constructor(message: string, status: number = 500, additionalInfo: any = {}) {
    this.message = message;
    this.status = status;
    this.additionalInfo = additionalInfo;
  }
}
