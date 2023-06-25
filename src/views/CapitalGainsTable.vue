<script setup lang="ts">
import { ref, type Ref } from "vue";
import { accType, depositWithDrawlTypes, incomingsOutgoingsTypes } from "@/models/accountTypes";
import type { AccountData, CalculatedGains } from "./TransactionView.vue";
defineProps<{
    accountDataMap: Map<string, AccountData>;
    calculatedGains: CalculatedGains;
}>();


</script>

<template>
    <h1>Capital Gains</h1>


    <h2>Earnings</h2>
    <h4>Incomings</h4>
    <div>{{ accType.Client }} | {{ accountDataMap.get(accType.Client)?.cryptoAmountReceived }} XRP | {{
        accountDataMap.get(accType.Client)?.fiatAmountReceived }} AUD</div>
    <div>{{ accType.Goods }} | {{ accountDataMap.get(accType.Goods)?.cryptoAmountReceived }} XRP | {{
        accountDataMap.get(accType.Goods)?.fiatAmountReceived }} AUD</div>
    <div></div>
    <h4>Outgoings</h4>
    <div>{{ accType.Client }} | {{ accountDataMap.get(accType.Client)?.cryptoAmountSent }} XRP | {{
        accountDataMap.get(accType.Client)?.fiatAmountSent }} AUD</div>
    <div>{{ accType.Goods }} | {{ accountDataMap.get(accType.Goods)?.cryptoAmountSent }} XRP | {{
        accountDataMap.get(accType.Goods)?.fiatAmountSent }} AUD</div>
    <br>
    <h4>---Calculated---</h4>
    <div>Cost of Crypto: ${{ calculatedGains.earningsFiat }}</div>
    <div>Current Price: ${{ calculatedGains.earningsCryptoFiat }} AUD ({{ calculatedGains.earningsCrypto }} XRP)</div>
    <div>Unrealized Gains: ${{ calculatedGains.earningsCryptoFiat - calculatedGains.earningsFiat }} AUD</div>
    <br>

    <h2>Holdings</h2>
    <h4>Deposits</h4>
    <div>{{ accType.Exchange }} | {{ accountDataMap.get(accType.Exchange)?.cryptoAmountReceived }} XRP | {{
        accountDataMap.get(accType.Exchange)?.fiatAmountReceived }} AUD</div>
    <h4>Withdraws</h4>
    <div>{{ accType.Exchange }} | {{ accountDataMap.get(accType.Exchange)?.cryptoAmountSent }} XRP | {{
        accountDataMap.get(accType.Exchange)?.fiatAmountSent }} AUD</div>
    <br>
    <h4>---Calculated---</h4>
    <div>Cost of Crypto: ${{ calculatedGains.assertsFiat }}</div>
    <div>Current Price: ${{ calculatedGains.assertsCryptoFiat }} AUD ({{ calculatedGains.assertsCrypto }} XRP)</div>
    <div>Unrealized Gains: ${{ calculatedGains.assertsCryptoFiat - calculatedGains.assertsFiat }} AUD</div>
    <br>
    <h2>TOTAL</h2>

    <div>Total Unrealized Gains: ${{ (calculatedGains.earningsCryptoFiat + calculatedGains.assertsCryptoFiat) -
        (calculatedGains.earningsFiat + calculatedGains.assertsFiat) }} AUD</div>



    <!-- <v-table width="100%" height="600px">
        <thead>
            <tr>
                <th class="text-left">Date</th>
                <th class="text-left">Amount</th>
                <th class="text-left">Currency</th>
                <th class="text-left">Direction</th>
                <th class="text-left">AUD</th>
                <th class="text-left">tx Address</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item, index) in txList" :key="index">
                <td>{{ item.date }}</td>
                <td>{{ item.amount }}</td>
                <td>{{ item.currency }}</td>
                <td>{{ item.direction }}</td>
                <td>${{ item.fiatAmount }}</td>
                <td>{{ item.txAddress }}
                    <AccountComponent :account="item.txAddress" :userAccount="'?'"></AccountComponent>
                </td>
            </tr>
        </tbody>
    </v-table> -->
</template>
