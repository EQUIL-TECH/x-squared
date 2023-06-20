<script setup lang="ts">
import { ref, type Ref } from "vue";
import type { TransactionAccounts, TransactionInfo } from "./TransactionView.vue";
import AccountComponent from "./accountComponent.vue"

defineProps<{
    txAccounts: TransactionAccounts;
    fees: number;
}>();

</script>

<template>
    <h2>Transaction Table</h2>
    <h3>Deposits</h3>
    <div>{{ txAccounts.Exchange.cryptoAmountReceived }} XRP | {{ txAccounts.Exchange.fiatAmountReceived }} AUD</div>
    <h3>Withdraws</h3>
    <div>{{ txAccounts.Exchange.cryptoAmountSent }} XRP | {{ txAccounts.Exchange.fiatAmountSent }} AUD</div>
    <h3>Incomings</h3>
    <h3>Outgoings</h3>

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
