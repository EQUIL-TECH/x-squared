<script setup lang="ts">
// import { getTransactions } from "@/services/xrpl";
import { onMounted } from "vue";
import { ref, type Ref } from "vue";
import type { Client, AccountTxResponse, TransactionMetadata, Payment, NFTokenAcceptOffer, NFTokenMint, TrustSet, AccountSet, NFTokenCreateOffer } from "xrpl";
import type { Transaction } from "xrpl";
import transactionTable from "./transactionTable.vue";
import { formatDate, getHistoricalCryptoPrice } from "@/services/coingecko";

// AccountDelete | AccountSet | CheckCancel | CheckCash | CheckCreate | DepositPreauth | EscrowCancel | EscrowCreate | EscrowFinish | NFTokenAcceptOffer | NFTokenBurn | NFTokenCancelOffer | NFTokenCreateOffer | NFTokenMint | OfferCancel | OfferCreate | Payment | PaymentChannelClaim | PaymentChannelCreate | PaymentChannelFund | SetRegularKey | SignerListSet | TicketCreate | TrustSet
// TODO: add these types into the transaction filters
const tab = ref(null)
const accountTypes = ["Exchange(AUD)", "3rd Party"]
const whoAccount: Ref<string[]> = ref([]);




const urlParams = new URLSearchParams(window.location.search);
const account = urlParams.get("account") || "rK1PizWFJUMGo2dURxhvSzwL2c3jEuBYz9";

const paymentsList: Ref<TransactionInfo[]> = ref([]);
const paymentsSentList: Ref<TransactionInfo[]> = ref([]);
const paymentsReceivedList: Ref<TransactionInfo[]> = ref([]);
const paymentsGroupedMap: Ref<Map<string, TransactionInfo[]>> = ref(new Map());
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

function groupBy(txList: TransactionInfo[], getKey: (item: TransactionInfo) => string): Map<string, TransactionInfo[]> {
  return txList.reduce((groupedItems: Map<string, TransactionInfo[]>, currentItem: TransactionInfo) => {
    const key = getKey(currentItem);
    if (!groupedItems.has(key)) {
      groupedItems.set(key, []);
    }
    groupedItems.get(key)!.push(currentItem);
    return groupedItems;
  }, new Map<string, TransactionInfo[]>());
}


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
  const direction = !sent ? "sent" : "received";
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
  for (const trans of transList) {
    const meta = trans.meta as TransactionMetadata;
    if (!trans.tx) {
      return null;
    }
    const tx: Transaction = trans.tx;

    // get date

    if (tx.TransactionType === "Payment") {
      const txInfo = getPaymentInfo(tx, account);
      const formattedDate = formatDate(txInfo.date);
      const price = await getHistoricalCryptoPrice(formattedDate)
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      txInfo.fiatRate = price;
      if (price) {
        const roundedAmount = Math.round(price * txInfo.amount * 100) / 100;

        txInfo.fiatAmount = roundedAmount;
      }
      if (txInfo.currency === "XRP") {
        paymentsTxInfoList.push(txInfo);
      } else {
        // todo: add logic for non-xrp payments
      }
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
  };
  client.disconnect();
  paymentsList.value = paymentsTxInfoList;

  paymentsSentList.value = paymentsTxInfoList.filter(
    (tx) => tx.direction === "sent"
  );
  paymentsReceivedList.value = paymentsTxInfoList.filter(
    (tx) => tx.direction === "received"
  );
  paymentsGroupedMap.value = groupBy(paymentsTxInfoList, (tx) => {
    whoAccount.value.concat("data")
    return tx.txAddress
  });


  return;
}

// onMounted(precessTransactions)

precessTransactions()

const deposits: Ref<TransactionInfo[]> = ref([])
const withdraws: Ref<TransactionInfo[]> = ref([])
const incomings: Ref<TransactionInfo[]> = ref([])
const outgoings: Ref<TransactionInfo[]> = ref([])

const depositsSum: Ref<number> = ref(0)
const withdrawsSum: Ref<number> = ref(0)
const incomingsSum: Ref<number> = ref(0)
const outgoingsSum: Ref<number> = ref(0)
const fees: Ref<number> = ref(0)

function calculate(paymentGrouped: Map<string, TransactionInfo[]>) {
  deposits.value = []
  withdraws.value = []
  incomings.value = []
  outgoings.value = []
  depositsSum.value = 0
  withdrawsSum.value = 0
  incomingsSum.value = 0
  outgoingsSum.value = 0

  const paymentGroupedKeys = paymentGrouped.keys()
  let index = 0
  for (const address of paymentGroupedKeys) {
    address as string;
    const txInfoList = paymentGrouped.get(address) ?? []
    for (const txInfo of txInfoList) {
      fees.value += txInfo.fee
      if (whoAccount.value[index] == "Exchange(AUD)") {
        if (txInfo.direction === "sent") {
          // sent
          withdraws.value.concat(txInfo)
          withdrawsSum.value += txInfo.amount
        } else {
          // received
          deposits.value.concat(txInfo)
          depositsSum.value += txInfo.amount
        }
      } else if (whoAccount.value[index] == "3rd Party" || whoAccount.value[index] == "Expense") {
        if (txInfo.direction === "sent") {
          // sent
          outgoings.value.concat(txInfo)
          outgoingsSum.value += txInfo.amount
        } else {
          // received
          incomings.value.concat(txInfo)
          incomingsSum.value += txInfo.amount
        }
      }
    }
    index += 1
  }

}

</script>

<template>
  <div>
    <v-tabs v-model="tab" color="primary" grow>
      <v-tab value="one">
        <h3>Raw Transactions</h3>
      </v-tab>
      <v-tab value="two">
        <h3>Sent Transactions</h3>
      </v-tab>
      <v-tab value="three">
        <h3>received Transactions</h3>
      </v-tab>
      <v-tab value="four">
        <h3>Grouped Transactions</h3>
      </v-tab>
    </v-tabs>

    <!-- Raw transactions -->
    <div v-if="tab === 'one'">
      <transactionTable :txList="paymentsList" />
    </div>
    <div v-if="tab === 'two'">
      <transactionTable :txList="paymentsSentList" />
    </div>
    <div v-if="tab === 'three'">
      <transactionTable :txList="paymentsReceivedList" />
    </div>
    <div v-if="tab === 'four'">
      <tr v-for="(item, index) in paymentsGroupedMap" :key="index">
        <div>

          <v-expansion-panels>
            <v-expansion-panel :title="item[0]">
              <div>
                <v-select density="compact" label="Select Account Type" v-model="whoAccount[index]"
                  :items="accountTypes"></v-select>
                <v-expansion-panel-text>
                  <v-card class="pa-5 mt-3">
                    <transactionTable :txList="item[1]" />

                  </v-card>
                </v-expansion-panel-text>

              </div>
            </v-expansion-panel>
          </v-expansion-panels>





        </div>

      </tr>

      <v-btn tonal block @click="calculate(paymentsGroupedMap)">CALCULATE</v-btn>

      <div>Deposit Crypto: {{ depositsSum }}</div>
      <div>Withdraw Crypto: {{ withdrawsSum }}</div>
      <div>Incomings: {{ incomingsSum }}</div>
      <div>Outgoings: {{ outgoingsSum }}</div>
      <div>Fees {{ fees }}</div>

    </div>
  </div>
</template>
