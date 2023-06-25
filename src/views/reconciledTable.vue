<script setup lang="ts">
import { ref, type Ref } from "vue";
import type { TransactionInfo } from "./TransactionView.vue";
import AccountComponent from "./accountComponent.vue"
import { getAddressData, type AddressDataMap, type AddressData } from "@/stores/addresses";

defineProps<{
    txList: TransactionInfo[];
}>();


function getNamedAddress(address: string): AddressData | null {
    const addMap: AddressDataMap = getAddressData()
    const namedAddress = addMap.get(address)
    if (namedAddress) {
        return namedAddress
    } else {
        return null
    }
}

</script>

<template>
    <v-table width="100%">
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
                <td>
                    <!-- {{ item.txAddress }} -->
                    <AccountComponent :account="item.txAddress" :userAccount="'?'"></AccountComponent>
                </td>
            </tr>
        </tbody>
    </v-table>
</template>
