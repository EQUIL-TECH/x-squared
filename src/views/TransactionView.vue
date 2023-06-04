<script setup lang="ts">
// import { getTransactions } from "@/services/xrpl";
import { onMounted } from "vue";
import { ref, type Ref } from "vue";
const transactions: Ref<TransactionG[]> = ref([])
import type { Client, AccountTxResponse, TransactionMetadata } from "xrpl";
import type { Transaction } from "xrpl";
// AccountDelete | AccountSet | CheckCancel | CheckCash | CheckCreate | DepositPreauth | EscrowCancel | EscrowCreate | EscrowFinish | NFTokenAcceptOffer | NFTokenBurn | NFTokenCancelOffer | NFTokenCreateOffer | NFTokenMint | OfferCancel | OfferCreate | Payment | PaymentChannelClaim | PaymentChannelCreate | PaymentChannelFund | SetRegularKey | SignerListSet | TicketCreate | TrustSet
// TODO: add these types into the transaction filters


type TransactionG = {
  validated: boolean,
  success: boolean,
  account: string,
  TransactionType: string,
  AccountTxnID: string,
}


async function fetchTransactions() {

  const req = {
    id: 2,
    command: "account_tx",
    account: "rK1PizWFJUMGo2dURxhvSzwL2c3jEuBYz9",
    forward: false,
  }

  // @ts-ignore
  const client: Client = new xrpl.Client("wss://xrplcluster.com")
  await client.connect()
  const response: AccountTxResponse = await client.request(req);
  const transList = response.result.transactions
  // get each ledger_index
  const maybeTransactions = transList.map((trans) => {
    const meta = trans.meta as TransactionMetadata;
    if (!trans.tx) {
      return null;
    }
    const tx: Transaction = trans.tx;
    return {
      validated: trans.validated,
      success: meta.TransactionResult === "tesSUCCESS",
      account: tx.Account,
      TransactionType: tx.TransactionType,
    }
  })
  transactions.value = maybeTransactions.filter(transaction => transaction !== null) as TransactionG[]
  // TODO make a function to deal with each transaction type
  client.disconnect()
  console.log(transList)
}

onMounted(fetchTransactions)

</script>

<template>
  <div>
    <v-table width="100%" height="600px">
      <thead>
        <tr>
          <th class="text-left">Type</th>
          <th class="text-left">Account</th>
          <th class="text-left">Success</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in transactions" :key="index">
          <td>{{ item.TransactionType }}</td>
          <td>{{ item.account }}</td>
          <td>{{ item.success }}</td>

        </tr>
      </tbody>
    </v-table>

  </div>
</template>
