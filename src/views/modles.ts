export enum Direction {
  SENT = "sent",
  RECEIVED = "received",
}

export type TransactionInfo = {
  tx_type: string;
  direction: string;
  amount: number;
  date: string;
  currency: string;
  is_fee: boolean;
  fee: number;
  hash: string;
  txAddress: string;
  fiatRate?: number | null;
  fiatAmount?: number | null;
};
