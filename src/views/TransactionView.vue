<script setup lang="ts">
// import { getTransactions } from "@/services/xrpl";
import { onMounted } from "vue";
import { ref, type Ref } from "vue";
import type { Client, AccountTxResponse, TransactionMetadata, Payment, NFTokenAcceptOffer, NFTokenMint, TrustSet, AccountSet, NFTokenCreateOffer } from "xrpl";
import type { Transaction } from "xrpl";
// AccountDelete | AccountSet | CheckCancel | CheckCash | CheckCreate | DepositPreauth | EscrowCancel | EscrowCreate | EscrowFinish | NFTokenAcceptOffer | NFTokenBurn | NFTokenCancelOffer | NFTokenCreateOffer | NFTokenMint | OfferCancel | OfferCreate | Payment | PaymentChannelClaim | PaymentChannelCreate | PaymentChannelFund | SetRegularKey | SignerListSet | TicketCreate | TrustSet
// TODO: add these types into the transaction filters
const tab = ref(null)
const account: string = "rK1PizWFJUMGo2dURxhvSzwL2c3jEuBYz9";
const paymentsList: Ref<TransactionInfo[]> = ref([]);


type TransactionInfo = {
  tx_type: string;
  direction: string;
  amount: number;
  date: string;
  currency: string;
  is_fee: boolean;
  fee: number;
  hash: string;
  txAddress: string;
};

function getDate(tx: Transaction) {
  const dateInt = new Map(Object.entries(tx)).get("date") as number | undefined;
  if (typeof dateInt === "number") {
    const date = new Date((dateInt + 946684800) * 1000);
    return date.toLocaleString();
  }
  return "";
}

function getHash(tx: Transaction) {
  const maybeHash = new Map(Object.entries(tx)).get("hash") as
    | string
    | undefined;
  if (maybeHash) {
    return maybeHash;
  }
  return "";
}

function getPaymentInfo(tx: Transaction, account: string) {
  const paymentTransaction = tx as Payment;
  const sent = paymentTransaction.Destination === account;
  const direction = sent ? "sent" : "received";
  let amount = 0;
  let currency = "XRP";
  const txAddress = sent
    ? paymentTransaction.Account
    : paymentTransaction.Destination;
  if (typeof paymentTransaction.Amount === "string") {
    amount = parseInt(paymentTransaction.Amount) / 1000000;
  } else {
    amount = parseInt(paymentTransaction.Amount.value);
    currency = paymentTransaction.Amount.currency;
  }
  const txInfo: TransactionInfo = {
    tx_type: tx.TransactionType,
    direction: direction,
    amount: amount,
    date: getDate(tx),
    currency: currency,
    is_fee: false,
    fee: parseInt(paymentTransaction.Fee ?? "0") / 1000000,
    hash: getHash(paymentTransaction),
    txAddress: txAddress,
  };
  return txInfo;
}

function getFeeTxInfo(
  tx: Transaction | AccountSet | TrustSet | NFTokenCreateOffer,
  account: string
) {
  const _tx = tx as NFTokenMint;
  let amount = 0;
  let currency = "XRP";

  const txInfo: TransactionInfo = {
    tx_type: tx.TransactionType,
    direction: "sent",
    amount: amount,
    date: getDate(tx),
    currency: currency,
    is_fee: true,
    fee: parseInt(_tx.Fee ?? "0") / 1000000,
    hash: getHash(_tx),
    txAddress: "",
  };
  return txInfo;
}

function getNFTokenAcceptOfferInfo(tx: Transaction, account: string) {
  const _tx = tx as NFTokenAcceptOffer;
  const brokerFee = _tx.NFTokenBrokerFee; // todo: add fee in
  _tx.NFTokenSellOffer;
  _tx.NFTokenBuyOffer;

  if (_tx.NFTokenSellOffer) {
    // add logic
  } else if (_tx.NFTokenBuyOffer) {
    // add logic
  }

  const sent = _tx.Account === account;
  const direction = sent ? "sent" : "received";
  let amount = 0; // ! WARNING THIS IS WRONG
  let currency = "XRP";
  const txInfo: TransactionInfo = {
    tx_type: tx.TransactionType,
    direction: direction,
    amount: amount,
    date: getDate(tx),
    currency: currency,
    is_fee: false,
    fee: parseInt(_tx.Fee ?? "0") / 1000000,
    hash: getHash(_tx),
    txAddress: "", // ! may need to update this
  };
  return txInfo;
}

async function precessTransactions() {
  const req = {
    id: 2,
    command: "account_tx",
    account: account,
    forward: false,
  };

  // @ts-ignore
  const client: Client = new xrpl.Client("wss://xrplcluster.com")
  await client.connect();
  const response: AccountTxResponse = await client.request(req);
  const transList = response.result.transactions;
  // get each ledger_index
  const paymentsTxInfoList: TransactionInfo[] = [];
  const maybeTransactions = transList.map((trans) => {
    const meta = trans.meta as TransactionMetadata;
    if (!trans.tx) {
      return null;
    }
    const tx: Transaction = trans.tx;

    // get date

    if (tx.TransactionType === "Payment") {
      const txInfo = getPaymentInfo(tx, account);
      paymentsTxInfoList.push(txInfo);
    } else if (
      tx.TransactionType === "NFTokenMint" ||
      tx.TransactionType === "AccountSet" ||
      tx.TransactionType === "NFTokenCreateOffer" ||
      tx.TransactionType === "TrustSet"
    ) {
      getFeeTxInfo(tx, account);
    } else if (tx.TransactionType === "NFTokenAcceptOffer") {
      const txInfo = getNFTokenAcceptOfferInfo(tx, account);
      // todo
    } else if (tx.TransactionType === "OfferCreate") {
      // todo
    } else {
      // todo
    }
  });
  client.disconnect();
  paymentsList.value = paymentsTxInfoList;

  return;
}

onMounted(precessTransactions)

</script>

<template>
  <div>
    <v-tabs v-model="tab" color="primary" grow>
      <v-tab value="one">
        <h3>Raw Transactions</h3>
      </v-tab>
      <v-tab value="two">
        <h3>Grouped Transactions</h3>
      </v-tab>
    </v-tabs>

    <!-- Raw transactions -->
    <div v-if="tab === 'one'">
      <v-table width="100%" height="600px">
        <thead>
          <tr>
            <th class="text-left">Date</th>
            <th class="text-left">Amount</th>
            <th class="text-left">Currency</th>
            <th class="text-left">Direction</th>
            <th class="text-left">tx Type</th>
            <th class="text-left">tx Address</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in paymentsList" :key="index">
            <td>{{ item.date }}</td>
            <td>{{ item.amount }}</td>
            <td>{{ item.currency }}</td>
            <td>{{ item.direction }}</td>
            <td>{{ item.tx_type }}</td>
            <td>{{ item.txAddress }}</td>
          </tr>
        </tbody>
      </v-table>


    </div>
  </div>
</template>
