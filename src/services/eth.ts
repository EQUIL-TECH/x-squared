import type { TransactionData } from "@/models/models";

interface Transaction {
  hash: string;
  blockNumber: number;
  from: string;
  to: string;
  value: number;
  rawValue: string;
  input: string;
  nonce: number;
  status: string;
  gasLimit: number;
  gasUsed: number;
  gasPrice: string;
  timestamp: number;
  success: boolean;
  confirmations: number;
}

interface Pager {
  pageSize: number;
}

interface EthPrice {
  rate: number;
  diff: number;
  diff7d: number;
  ts: number;
  marketCapUsd: number;
  availableSupply: number;
  volume24h: number;
  volDiff1: number;
  volDiff7: number;
  volDiff30: number;
  diff30d: number;
}

interface EthereumTransactionData {
  tx: Transaction;
  contracts: any[]; // You may want to replace `any` with the actual type, if known
  operations: any[]; // You may want to replace `any` with the actual type, if known
  pager: Pager;
  ethPrice: EthPrice;
}

function timestampToDateStr(timestamp: number): string {
  const dateObj = new Date(timestamp * 1000);

  const year = dateObj.getUTCFullYear();
  const month =
    (dateObj.getUTCMonth() + 1 < 10 ? "0" : "") + (dateObj.getUTCMonth() + 1);
  const day = (dateObj.getUTCDate() < 10 ? "0" : "") + dateObj.getUTCDate();
  const hours = (dateObj.getUTCHours() < 10 ? "0" : "") + dateObj.getUTCHours();
  const minutes =
    (dateObj.getUTCMinutes() < 10 ? "0" : "") + dateObj.getUTCMinutes();
  const seconds =
    (dateObj.getUTCSeconds() < 10 ? "0" : "") + dateObj.getUTCSeconds();

  return day + "-" + month + "-" + year;
}

export async function getEthereumTransactionData(
  transactionHash: string,
  toAddress: string | null
): Promise<TransactionData | null> {
  // Get transaction data from Blockstream
  const transactionUrl =
    "https://ethplorer.io/service/service.php?data=0x9e1ca484829ac635f92e1b175f6d005a78072cbead93c516bd0db224aa40fbd8";
  //   const transactionUrl = `https://ethplorer.io/service/service.php?data=${transactionHash}`;

  const request = await fetch(transactionUrl);
  if (!request.ok) {
    console.log("Error fetching data:", request.status, request.statusText);
    return null;
  }

  const transactionData: EthereumTransactionData = await request.json();

  // convert timestamp to date

  console.log({
    paymentAddress: transactionData.tx.to,
    payerAddress: transactionData.tx.from,
    amount: transactionData.tx.value,
    paidDate: timestampToDateStr(transactionData.tx.timestamp),
  });

  return {
    paymentAddress: transactionData.tx.to,
    payerAddress: transactionData.tx.from,
    amount: transactionData.tx.value,
    paidDate: timestampToDateStr(transactionData.tx.timestamp),
  };
}
