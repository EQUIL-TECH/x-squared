<script setup lang="ts">
// import { getTransactions } from "@/services/xrpl";
import { onMounted } from "vue";
import { ref, type Ref } from "vue";
import type { Client, AccountTxResponse, TransactionMetadata, Payment, NFTokenAcceptOffer, NFTokenMint, TrustSet, AccountSet, NFTokenCreateOffer, AccountInfoResponse } from "xrpl";
import type { Transaction } from "xrpl";
import transactionTable from "./transactionTable.vue";
import CapitalGainsTable from "./CapitalGainsTable.vue";
import { formatDate, getCurrentRipplePriceInAUD, getHistoricalCryptoPrice } from "@/services/coingecko";
import { accType, accountTypes, depositWithDrawlTypes, incomingsOutgoingsTypes } from "@/models/accountTypes";
import { addAddressData, AddressDataMapRef, getAddressData } from "@/stores/addresses";
import AccountComponent from "./accountComponent.vue"
import tokensComponent from "./tokensComponent.vue"
import monthlyCashflow from "./monthlyCashflow.vue"
import { Direction, type TransactionInfo } from "./modles";



// AccountDelete | AccountSet | CheckCancel | CheckCash | CheckCreate | DepositPreauth | EscrowCancel | EscrowCreate | EscrowFinish | NFTokenAcceptOffer | NFTokenBurn | NFTokenCancelOffer | NFTokenCreateOffer | NFTokenMint | OfferCancel | OfferCreate | Payment | PaymentChannelClaim | PaymentChannelCreate | PaymentChannelFund | SetRegularKey | SignerListSet | TicketCreate | TrustSet
// TODO: add these types into the transaction filters
const tab: Ref<string | null> = ref(null)
const todaysRate: Ref<number | null> = ref(null) // ! WARNING need to get this from coingecko
const newUserAddress = ref("")
const newUserName = ref("")
const buttonclick = ref(false)

function handleButtonClick() {
  buttonclick.value = true
}


export type AccountData = {
  accountType: accType,
  cryptoAmountSent: number,
  cryptoAmountReceived: number,
  fiatAmountSent: number,
  fiatAmountReceived: number,
  txListSent: TransactionInfo[]
  txListReceived: TransactionInfo[]
}


export type CalculatedGains = {
  earningsCrypto: number,
  earningsCryptoFiat: number,
  earningsFiat: number,
  earningsGainFiat: number,
  fees: number,
  assertsCrypto: number,
  assertsCryptoFiat: number,
  assertsFiat: number,
  assetGainFiat: number,
}

const calculatedGains: Ref<CalculatedGains> = ref({
  earningsCrypto: 0,
  earningsCryptoFiat: 0,
  earningsFiat: 0,
  earningsGainFiat: 0,
  fees: 0,
  assertsCrypto: 0,
  assertsCryptoFiat: 0,
  assertsFiat: 0,
  assetGainFiat: 0,
})

function resetTransactionAccounts(): Map<accType, AccountData> {
  const outMap = new Map<accType, AccountData>();
  accountTypes.forEach((accountType) => {
    outMap.set(accountType, {
      accountType: accountType,
      cryptoAmountSent: 0,
      cryptoAmountReceived: 0,
      fiatAmountSent: 0,
      fiatAmountReceived: 0,
      txListSent: [],
      txListReceived: []
    });
  });
  return outMap;
}
const accountDataMap: Ref<Map<accType, AccountData>> = ref(resetTransactionAccounts())

const whoAccount: Ref<(accType | null)[]> = ref([]);



let address: Ref<string | null> = ref(null);


const balance: Ref<number | null> = ref(null);
const nowDate = new Date().toDateString();


const paymentsList: Ref<TransactionInfo[]> = ref([]);
const paymentsSentList: Ref<TransactionInfo[]> = ref([]);
const paymentsReceivedList: Ref<TransactionInfo[]> = ref([]);


const paymentsGroupedMap: Ref<Map<string, TransactionInfo[]>> = ref(new Map());


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


const tryCryptoPrice = async (formattedDate: string): Promise<number | null> =>
  getHistoricalCryptoPrice(formattedDate)
    .catch(async _ => {
      await new Promise((resolve) => setTimeout(resolve, 20000));
      return await tryCryptoPrice(formattedDate)
    })


async function getBalance() {
  const req = {
    id: 2,
    command: "account_info",
    account: address.value,
  };

  // @ts-ignore
  const client: Client = new xrpl.Client("wss://xrplcluster.com")
  await client.connect();

  const response: AccountInfoResponse = await client.request(req);
  const bal = response.result.account_data.Balance;
  balance.value = parseInt(bal) / 1000000;
  client.disconnect();
  todaysRate.value = await getCurrentRipplePriceInAUD()
  console.log("todaysRate", todaysRate.value)
  return parseInt(bal) / 1000000;
}

async function precessTransactions() {
  let addr = "";
  const addressDataMap = getAddressData();
  const addressDataList = Array.from(addressDataMap.values());
  const ownedAddressDataList = addressDataList.filter((addressData) => addressData.owned);
  try {
    const addData = ownedAddressDataList[0]
    address.value = addData.address;
  } catch (error) {
    console.log("no address found")
  }


  if (address.value === null) {
    return;
  } else {
    addr = address.value;
  }
  const req = {
    id: 2,
    command: "account_tx",
    account: addr,
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
      const txInfo = getPaymentInfo(tx, addr);
      const formattedDate = formatDate(txInfo.date);
      let price: number | null = await tryCryptoPrice(formattedDate)
      // let price: number | null = 0.7

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
      getFeeTxInfo(tx, addr);
    } else if (tx.TransactionType === "NFTokenAcceptOffer") {
      const txInfo = getNFTokenAcceptOfferInfo(tx, addr);
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
    whoAccount.value.concat(null)
    return tx.txAddress
  });


  return;
}


onMounted(precessTransactions)
onMounted(getBalance)

// precessTransactions()


const fees = ref(0)


function updateAccountData(accountData: AccountData, txInfo: TransactionInfo): AccountData {
  if (txInfo.direction === "sent") {
    accountData.cryptoAmountSent += txInfo.amount
    accountData.fiatAmountSent += txInfo.fiatAmount ?? 0
    return accountData
  } else {
    accountData.cryptoAmountReceived += txInfo.amount
    accountData.fiatAmountReceived += txInfo.fiatAmount ?? 0
    return accountData
  }

}


function calculate(paymentGrouped: Map<string, TransactionInfo[]>) {
  accountDataMap.value = resetTransactionAccounts()
  const paymentGroupedKeys = paymentGrouped.keys()
  let index = 0
  console.log(whoAccount.value)
  const rateToday = todaysRate.value
  if (!rateToday) {
    return
  }
  for (const address of paymentGroupedKeys) {
    address as string;
    const txInfoList = paymentGrouped.get(address) ?? []
    const aType = whoAccount.value[index]
    console.log(aType)
    if (!aType) {
      continue
    }

    for (const txInfo of txInfoList) {
      fees.value += txInfo.fee


      const accData = accountDataMap.value.get(aType)
      if (accData) {
        const updatedAccData = updateAccountData(accData, txInfo)
        accountDataMap.value.set(aType, updatedAccData)
      }

    }
    index += 1

  }
  calculatedGains.value.earningsCrypto -= fees.value
  incomingsOutgoingsTypes.forEach((aType) => {
    calculatedGains.value.earningsCrypto += accountDataMap.value.get(aType)?.cryptoAmountReceived ?? 0
    calculatedGains.value.earningsCrypto -= accountDataMap.value.get(aType)?.cryptoAmountSent ?? 0
    calculatedGains.value.earningsFiat += accountDataMap.value.get(aType)?.fiatAmountReceived ?? 0
    calculatedGains.value.earningsFiat -= accountDataMap.value.get(aType)?.fiatAmountSent ?? 0
  })
  depositWithDrawlTypes.forEach((aType) => {
    calculatedGains.value.assertsCrypto += accountDataMap.value.get(aType)?.cryptoAmountReceived ?? 0
    calculatedGains.value.assertsCrypto -= accountDataMap.value.get(aType)?.cryptoAmountSent ?? 0
    calculatedGains.value.assertsFiat += accountDataMap.value.get(aType)?.fiatAmountReceived ?? 0
    calculatedGains.value.assertsFiat -= accountDataMap.value.get(aType)?.fiatAmountSent ?? 0
  })
  calculatedGains.value.earningsCryptoFiat = calculatedGains.value.earningsCrypto * rateToday
  calculatedGains.value.earningsGainFiat = calculatedGains.value.earningsCryptoFiat - calculatedGains.value.earningsFiat
  calculatedGains.value.assertsCryptoFiat = calculatedGains.value.assertsCrypto * rateToday
  calculatedGains.value.assetGainFiat = calculatedGains.value.assertsCryptoFiat - calculatedGains.value.assertsFiat
}

function addUserAddress() {
  if (newUserAddress.value && newUserName.value) {
    addAddressData(newUserAddress.value, newUserName.value, "Owned", true)
    precessTransactions()
    getBalance()
  }
}



</script>

<template>
  <v-row class="mb-10">
    <h1>Reconcile</h1>
  </v-row>
  <v-row>
    <v-col cols="12" lg="12">
      <div>
        <v-tabs v-model="tab" color="primary" grow>
          <v-tab value="one">
            <h3>Accounts Dashboard</h3>
          </v-tab>
          <v-tab value="two">
            <h3>Raw Transactions</h3>
          </v-tab>
          <v-tab value="three">
            <h3>Grouped Transactions</h3>
          </v-tab>
          <v-tab value="four">
            <div style="background-color: #cff1ff; padding: 5px;">
              <h3>Reports</h3>
            </div>
          </v-tab>
        </v-tabs>

        <!-- Raw transactions -->
        <div v-if="tab === 'one'">
          <v-col cols="2" lg="6" md="6" sm="12">
            <div v-if="address">

              <br>

              <v-card elevation="10">
                <v-card-text class="pa-5 pt-2 text-left">
                  <small>{{ nowDate }}</small>
                  <h3 class="title mb-1 mt-1">{{ AddressDataMapRef.get(address)?.name }}</h3>
                  <p>{{ balance }} XRP</p>
                  <div v-if="todaysRate && balance">

                    <p>{{ balance * todaysRate }} AUD</p>

                  </div>

                  <AccountComponent :account="address"></AccountComponent>
                </v-card-text>
              </v-card>
              <br>
              <v-card elevation="10">
                <tokensComponent :address="address"></tokensComponent>
              </v-card>
              <br>
              <v-card elevation="10">
                <monthlyCashflow :tx-list="paymentsList" :direction="Direction.SENT"></monthlyCashflow>
              </v-card>
              <br>
              <v-card elevation="10">
                <monthlyCashflow :tx-list="paymentsList" :direction="Direction.RECEIVED"></monthlyCashflow>
              </v-card>

            </div>
            <div v-else>
              <br>
              <v-card class="pa-5" elevation="2">
                <h3>Enter Address</h3>
                <p>To get started, enter your XRP address.</p><br>
                <div class="d-flex justify-space-between center">
                  <v-text-field class="" density="compact" label="XRP Address" v-model="newUserAddress"></v-text-field>
                  <v-text-field class="ml-5" density="compact" label="XRP Address Name"
                    v-model="newUserName"></v-text-field>
                  <v-btn color="primary" class="ml-5 mr-5" style="height: 42px;" variant="tonal"
                    @click="addUserAddress">Add</v-btn>
                </div>
              </v-card>

            </div>

          </v-col>


        </div>
        <div v-if="tab === 'two'">
          <transactionTable :txList="paymentsList" />
        </div>
        <div v-if="tab === 'three'">
          <v-card class="pa-5">
            <h3>Categorise your transactions to generate a report</h3>
            <p>Only assigned transactions will be included in the report calculation.</p>
            <!-- <v-btn tonal class="mt-3" closable @click="tab = 'four'">

            </v-btn> -->
          </v-card>
          <table width="100%" class="mt-5">
            <tr v-for="(item, index) in paymentsGroupedMap" :key="index" width="100%">
              <td>
                <v-card variant="outlined" class="mb-5">
                  <v-expansion-panels style="width: 100%" variant="accordion" class="mb-3">
                    <v-expansion-panel :title="item[0]">
                      <div>
                        <v-expansion-panel-text>

                          <transactionTable :txList="item[1]" />

                        </v-expansion-panel-text>

                      </div>
                    </v-expansion-panel>
                  </v-expansion-panels>
                  <div class="d-flex justify-space-between center">
                    <v-text-field class="ml-5" density="compact" label="Account Name"></v-text-field>
                    <v-select class="mb-0 pb-0 ml-5" density="compact" label="Select Account Type"
                      v-model="whoAccount[index]" :items="accountTypes"></v-select>
                    <v-btn color="primary" class="ml-5 mr-5" style="height: 42px;" variant="tonal">SAVE</v-btn>
                    <!-- <v-chip prepend-icon="mdi-check" class="ma-5 mt-0" color="green">Reconciled</v-chip> -->
                  </div>
                </v-card>
              </td>
            </tr>
          </table>
        </div>
        <div v-if="tab === 'four'">
          <v-card class="pa-5">
            <div v-if="buttonclick === false">
              <h3>Generate a report</h3>
              <p>Report is based on grouped transactions you have assigned a category to.</p>
              <v-btn color="primary" class="mt-3" closable @click="calculate(paymentsGroupedMap); handleButtonClick()">
                <h3>CALCULATE</h3>
              </v-btn>
            </div>
            <div v-else>
              <CapitalGainsTable :accountDataMap="accountDataMap" :calculatedGains="calculatedGains" />
            </div>
          </v-card>
        </div>

      </div>
    </v-col>
    <!-- <v-col cols="12" lg="3">
      <v-card class="pa-5">

        <v-btn tonal block @click="calculate(paymentsGroupedMap)">
          <h3>CALCULATE</h3>
        </v-btn>

        <CapitalGainsTable :accountDataMap="accountDataMap" :calculatedGains="calculatedGains" />

      </v-card>
    </v-col> -->
  </v-row>
</template>
