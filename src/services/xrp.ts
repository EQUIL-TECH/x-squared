import type { XrplTransaction, TransactionData } from "@/models/models";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = String(date.getDate()); //.padStart(2, "0");
  const month = String(date.getMonth() + 1); //.padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export async function getXrplTransactionData(
  transactionHash: string,
  toAddress: string | null
): Promise<TransactionData | null> {
  // Get transaction data from XRPL
  const transactionUrl = `https://api.xrpscan.com/api/v1/tx/${transactionHash}`;
  const request = await fetch(transactionUrl);
  if (!request.ok) {
    console.log("Error fetching data:", request.status, request.statusText);
    return null;
  }

  const transactionData: XrplTransaction = await request.json();

  return {
    paymentAddress: transactionData.Destination,
    payerAddress: transactionData.Account,
    amount: transactionData.Amount.value / 1000000,
    paidDate: formatDate(transactionData.date),
  };
}
