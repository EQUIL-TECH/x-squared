<script setup lang="ts">
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
} from 'chart.js'
import { Bar } from 'vue-chartjs'
import type { Direction, TransactionInfo } from './modles';





const props = defineProps<{
    txList: TransactionInfo[];
    direction: Direction;
}>();

function calculateMonths() {
    const currentDate = new Date();
    const thisYear = currentDate.getFullYear();
    const thisMonth = currentDate.getMonth();

    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    const lastSixMonths = Array.from({ length: 6 }).map((_, idx) => {
        const month = (thisMonth - idx + 12) % 12;
        return monthNames[month];
    }).reverse();

    const transactionsByMonth = props.txList.filter(tx => {
        const txDate = new Date(tx.date.split(",")[0].split("/").reverse().join("-"));
        return txDate.getFullYear() === thisYear && tx.direction === props.direction;
    }).reduce((acc, tx) => {
        const txDate = new Date(tx.date.split(",")[0].split("/").reverse().join("-"));
        const month = txDate.getMonth();
        if (!acc[month]) acc[month] = 0;
        acc[month] += tx.amount;
        return acc;
    }, {} as { [key: number]: number });

    const dataForMonths = lastSixMonths.map(month => {
        const monthIndex = monthNames.indexOf(month);
        return transactionsByMonth[monthIndex] || 0;
    });

    const color = props.direction === "received" ? "lightgreen" : "lightblue";

    return {
        labels: lastSixMonths,
        datasets: [
            {
                label: `${props.direction} Transactions`,
                backgroundColor: color,
                data: dataForMonths
            }
        ]
    }
}

const options = {
    responsive: true,
    maintainAspectRatio: false
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)
</script>

<template>
    <Bar :data="calculateMonths()" :options="options" />
</template>
