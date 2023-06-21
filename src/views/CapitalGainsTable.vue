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
    <h2>Transaction Table</h2>
    <h3>Earnings</h3>
    <h4>Deposits</h4>
    <div>{{ accType.Exchange }} | {{ accountDataMap.get(accType.Exchange)?.cryptoAmountReceived }} XRP | {{
        accountDataMap.get(accType.Exchange)?.cryptoAmountReceived }} AUD</div>
    <div>{{ accType.Owned }} | {{ accountDataMap.get(accType.Owned)?.cryptoAmountReceived }} XRP | {{
        accountDataMap.get(accType.Owned)?.cryptoAmountReceived }} AUD</div>
    <div></div>
    <h4>Withdraws</h4>
    <div>{{ accType.Exchange }} | {{ accountDataMap.get(accType.Exchange)?.cryptoAmountSent }} XRP | {{
        accountDataMap.get(accType.Exchange)?.cryptoAmountSent }} AUD</div>
    <div>{{ accType.Owned }} | {{ accountDataMap.get(accType.Owned)?.cryptoAmountSent }} XRP | {{
        accountDataMap.get(accType.Owned)?.cryptoAmountSent }} AUD</div>
    <div></div>
    <div></div>
    <h3>Holdings</h3>
    <h4>Incomings</h4>
    <div>{{ accType.Client }} | {{ accountDataMap.get(accType.Client)?.cryptoAmountReceived }} XRP | {{
        accountDataMap.get(accType.Client)?.cryptoAmountReceived }} AUD</div>
    <div>{{ accType.Goods }} | {{ accountDataMap.get(accType.Goods)?.cryptoAmountReceived }} XRP | {{
        accountDataMap.get(accType.Goods)?.cryptoAmountReceived }} AUD</div>
    <div></div>
    <h4>Outgoings</h4>
    <div>{{ accType.Client }} | {{ accountDataMap.get(accType.Client)?.cryptoAmountSent }} XRP | {{
        accountDataMap.get(accType.Client)?.cryptoAmountSent }} AUD</div>
    <div>{{ accType.Goods }} | {{ accountDataMap.get(accType.Goods)?.cryptoAmountSent }} XRP | {{
        accountDataMap.get(accType.Goods)?.cryptoAmountSent }} AUD</div>
    <div></div>
    <div></div>
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
