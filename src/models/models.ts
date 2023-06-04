interface Amount {
  value: number;
  currency: string;
}

interface DeliveredAmount extends Amount {}

interface FinalFields {
  Account: string;
  Balance: string;
  Flags: number;
  OwnerCount: number;
  Sequence: number;
}

interface PreviousFields {
  Balance?: string;
  Sequence?: number;
}

interface ModifiedNode {
  FinalFields: FinalFields;
  LedgerEntryType: string;
  LedgerIndex: string;
  PreviousFields: PreviousFields;
  PreviousTxnID: string;
  PreviousTxnLgrSeq: number;
}

interface AffectedNode {
  ModifiedNode: ModifiedNode;
}

interface Meta {
  delivered_amount: DeliveredAmount;
  AffectedNodes: AffectedNode[];
  TransactionIndex: number;
  TransactionResult: string;
}

export interface XrplTransaction {
  Amount: Amount;
  meta: Meta;
  NFTokenOffers: any[];
  Paths: any[];
  Account: string;
  Destination: string;
  Fee: number;
  LastLedgerSequence: number;
  Sequence: number;
  SigningPubKey: string;
  TransactionType: string;
  TxnSignature: string;
  hash: string;
  ledger_index: number;
  date: string;
  Signers: any[];
  Memos: any[];
  AccountName: null;
  DestinationName: null;
  AmendmentName: null;
  SigningPubKeyAccount: string;
}

export type TransactionData = {
  paymentAddress: string;
  payerAddress: string;
  amount: number;
  paidDate: string;
};
