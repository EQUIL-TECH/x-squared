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
    <div class="container mt-4">
        <div class="text-left mb-4">
            <h1 class="text-primary">Capital Gains</h1>
        </div>
        <div class="mb-5 calculated-box">

            <div class="mb-5">
                <h2 class="text-primary">Earnings</h2>
                <table class="table">
                    <thead>
                        <tr>
                            <th width="30%">Type</th>
                            <th width="30%">Crypto Received</th>
                            <th width="30%">Fiat Received</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="type in [accType.Client, accType.Goods]" :key="type">
                            <td>{{ type }}</td>
                            <td>{{ accountDataMap.get(type)?.cryptoAmountReceived }} XRP</td>
                            <td>{{ accountDataMap.get(type)?.fiatAmountReceived.toFixed(2) }} AUD</td>
                        </tr>
                    </tbody>
                </table>

                <table class="table">
                    <thead>
                        <tr>
                            <th width="30%">Type</th>
                            <th width="30%">Crypto Sent</th>
                            <th width="30%">Fiat Sent</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="type in [accType.Client, accType.Goods]" :key="type">
                            <td>{{ type }}</td>
                            <td>{{ accountDataMap.get(type)?.cryptoAmountSent }} XRP</td>
                            <td>{{ accountDataMap.get(type)?.fiatAmountSent.toFixed(2) }} AUD</td>
                        </tr>
                    </tbody>
                </table>

                <!-- Outgoings and Calculated sections remain unchanged -->
            </div>
            <div style="padding: 10px;">
                <h3>Totals</h3>

                <!-- Deposit, Withdrawals, and Calculated sections remain unchanged -->

                <div class="mb-3">
                    <div>Cost of Crypto: ${{ calculatedGains.earningsFiat.toFixed(2) }}</div>
                    <div>Current Price: ${{ calculatedGains.earningsCryptoFiat.toFixed(2) }} AUD ({{
                        calculatedGains.earningsCrypto }} XRP)
                    </div>
                    <div
                        :style="{ color: calculatedGains.earningsCryptoFiat - calculatedGains.earningsFiat < 0 ? 'red' : 'black' }">
                        Unrealized Gains: ${{ (calculatedGains.earningsCryptoFiat - calculatedGains.earningsFiat).toFixed(2)
                        }}
                        AUD
                    </div>
                </div>
            </div>
        </div>
        <div class="mb-5 calculated-box">

            <div class="mb-5">
                <h2 class="text-primary">Holdings</h2>
                <table class="table">
                    <thead>
                        <tr>
                            <th width="30%">Type</th>
                            <th width="30%">Crypto Received</th>
                            <th width="30%">Fiat Received</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="type in [accType.Exchange]" :key="type">
                            <td>{{ type }}</td>
                            <td>{{ accountDataMap.get(type)?.cryptoAmountReceived }} XRP</td>
                            <td>{{ accountDataMap.get(type)?.fiatAmountReceived.toFixed(2) }} AUD</td>
                        </tr>
                    </tbody>
                </table>

                <table class="table">
                    <thead>
                        <tr>
                            <th width="30%">Type</th>
                            <th width="30%">Crypto Sent</th>
                            <th width="30%">Fiat Sent</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="type in [accType.Exchange]" :key="type">
                            <td>{{ type }}</td>
                            <td>{{ accountDataMap.get(type)?.cryptoAmountSent }} XRP</td>
                            <td>{{ accountDataMap.get(type)?.fiatAmountSent.toFixed(2) }} AUD</td>
                        </tr>
                    </tbody>
                </table>
                <!-- Outgoings and Calculated sections remain unchanged -->
            </div>

            <h3>Totals</h3>

            <!-- Deposit, Withdrawals, and Calculated sections remain unchanged -->

            <div class="mb-3">
                <div>Cost of Crypto: ${{ calculatedGains.assertsFiat.toFixed(2) }}</div>
                <div>Current Price: ${{ calculatedGains.assertsCryptoFiat.toFixed(2) }} AUD ({{
                    calculatedGains.assertsCrypto }} XRP)
                </div>
                <div
                    :style="{ color: calculatedGains.assertsCryptoFiat - calculatedGains.assertsFiat < 0 ? 'red' : 'black' }">
                    Unrealized Gains: ${{ (calculatedGains.assertsCryptoFiat - calculatedGains.assertsFiat).toFixed(2) }}
                    AUD
                </div>
            </div>

        </div>

        <div>
            <h2>TOTAL</h2>
            <div :style="{
                color: (calculatedGains.earningsCryptoFiat + calculatedGains.assertsCryptoFiat) -
                    (calculatedGains.earningsFiat + calculatedGains.assertsFiat) < 0 ? 'red' : 'black'
            }">
                Total Unrealized Gains: ${{ (calculatedGains.earningsCryptoFiat + calculatedGains.assertsCryptoFiat) -
                    (calculatedGains.earningsFiat + calculatedGains.assertsFiat) }} AUD
            </div>
        </div>
    </div>
</template>
    
<style scoped>
h1 {
    color: #17a2b8;
}

h2 {
    color: #007bff;
}

h4 {
    color: #6c757d;
}

.calculated-box {
    border: 1px solid #dee2e6;
    border-radius: 0.25rem;
    padding: 15px;
}

.table {
    width: 100%;
    margin-bottom: 1rem;
    color: #212529;
}

.table th,
.table td {
    padding: 0.75rem;
    vertical-align: top;
    border-top: 1px solid #dee2e6;
    text-align: left;
    /* Aligns text to the left */
}

.table thead th {
    vertical-align: bottom;
    border-bottom: 2px solid #dee2e6;
}
</style>