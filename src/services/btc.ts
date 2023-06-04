import type { TransactionData } from "@/models/models";

interface TransactionInput {
  txid: string;
  vout: number;
  prevout: {
    scriptpubkey: string;
    scriptpubkey_asm: string;
    scriptpubkey_type: string;
    scriptpubkey_address: string;
    value: number;
  };
  scriptsig: string;
  scriptsig_asm: string;
  witness: string[];
  is_coinbase: boolean;
  sequence: number;
  inner_redeemscript_asm: string;
  inner_witnessscript_asm: string;
}

interface TransactionOutput {
  scriptpubkey: string;
  scriptpubkey_asm: string;
  scriptpubkey_type: string;
  scriptpubkey_address: string;
  value: number;
}

interface TransactionStatus {
  confirmed: boolean;
  block_height: number;
  block_hash: string;
  block_time: number;
}

export interface BitcoinTransaction {
  txid: string;
  version: number;
  locktime: number;
  vin: TransactionInput[];
  vout: TransactionOutput[];
  size: number;
  weight: number;
  fee: number;
  status: TransactionStatus;
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000); // Bitcoin timestamps are in seconds
  const day = String(date.getDate()); //.padStart(2, "0");
  const month = String(date.getMonth() + 1); //.padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

function concatenateInputAddresses(inputs: TransactionInput[]): string {
  const addresses = inputs.map((input) => input.prevout.scriptpubkey_address);
  return addresses.join(";");
}

function concatenateOutputAddresses(inputs: TransactionOutput[]): string {
  const addresses = inputs.map((input) => input.scriptpubkey_address);
  return addresses.join(";");
}

function calculateTotalInputValue(inputs: TransactionInput[]): number {
  let totalValue = 0;
  for (const input of inputs) {
    totalValue += input.prevout.value;
  }
  return totalValue;
}

function calculateTotalOutputValue(inputs: TransactionOutput[]): number {
  let totalValue = 0;
  for (const input of inputs) {
    totalValue += input.value;
  }
  return totalValue;
}

function findValue(
  outputs: TransactionOutput[],
  address: string
): number | null {
  for (const output of outputs) {
    if (output.scriptpubkey_address === address) {
      return output.value;
    }
  }
  return null;
}

export async function getBitcoinTransactionData(
  transactionHash: string,
  toAddress: string | null
): Promise<TransactionData | null> {
  if (!toAddress) {
    alert("Please enter a valid transaction hash");
    return null;
  }
  // Get transaction data from Blockstream
  const transactionUrl = `https://blockstream.info/api/tx/${transactionHash}`;
  const request = await fetch(transactionUrl);
  if (!request.ok) {
    console.log("Error fetching data:", request.status, request.statusText);
  }

  const transactionData: BitcoinTransaction = await request.json();

  const inVal = calculateTotalInputValue(transactionData.vin);
  const outVal = calculateTotalOutputValue(transactionData.vout);

  if (inVal !== outVal + transactionData.fee) {
    console.error("Transaction value does not match input and output values");
    return null;
  }

  const amount = findValue(transactionData.vout, toAddress);

  if (amount === null) {
    console.error("Transaction does not contain output to the given address");
    return null;
  }

  const concatPayerAddress = concatenateInputAddresses(transactionData.vin);
  const concatPaymentAddress = concatenateOutputAddresses(transactionData.vout);
  return {
    paymentAddress: toAddress,
    payerAddress: "Unknown",
    amount: amount / 100000000, // convert from satoshis to BTC
    paidDate: formatDate(transactionData.status.block_time),
  };
}
