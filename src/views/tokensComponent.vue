<script setup lang="ts">
import { onMounted } from "vue";
import { ref, type Ref } from "vue";

const props = defineProps<{
    address: string;
}>();

type Line = {
    account: string;
    balance: string;
    currency: string;
    limit: string,
}
import type { AccountInfoResponse } from "xrpl";


async function getAccInfo(address: string) {
    const req = {
        id: 2,
        command: "account_info",
        account: address,
    };

    // @ts-ignore
    const client: Client = new xrpl.Client("wss://xrplcluster.com")
    await client.connect();

    const response: AccountInfoResponse = await client.request(req);
    client.disconnect();
    console.log(response);
}


const lines: Ref<Line[]> = ref([]);

async function checkTokenBalance() {

    // @ts-ignore
    const client: Client = new xrpl.Client("wss://xrplcluster.com")
    await client.connect();
    const all_balances = await client.request({
        command: "account_lines",
        account: props.address,
        ledger_index: "validated",
    });
    client.disconnect();
    // for (let line of all_balances.result.lines) {
    //     console.log("line", line);
    //     getAccInfo(line.account);
    // }
    lines.value = all_balances.result.lines as Line[];
}

onMounted(() => {
    checkTokenBalance();
});


</script>

<template>
    <div>
        <h1>Tokens</h1>
        <div v-for="(line, index) in lines" :key="index">
            <p>{{ line.balance }} {{ line.currency }}</p>
        </div>

    </div>
</template>
