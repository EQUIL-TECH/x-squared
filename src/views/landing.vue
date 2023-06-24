<script setup lang="ts">
import { ref } from "vue";
import { useCustomizerStore } from "@/stores/customizer";
const customizer = useCustomizerStore();
import HeroLight from "@/layouts/full/hero/HeroLight.vue";
import HeroDark from "@/layouts/full/hero/HeroDark.vue";
import IconLight from "@/layouts/full/icon/IconLight.vue";
import IconDark from "@/layouts/full/icon/IconDark.vue";

</script>
<template>
    <v-row class="center align-center">
        <v-col cols="12" lg="6" class="align-center">
            <div class="pa-4 pl-1">
                <IconDark style=" width: 15%" v-if="!customizer.darktheme && customizer.navbarColor == '#ffffff'" />
                <IconLight style=" width: 15%" v-else />
            </div>
            <h1 style="font-size: 80px; line-height: 72px;" class="mb-5">Your XRP accounted for</h1>
            <p style="font-size: 24px;">For Australians using XRP for transactions</p>
            <!-- <v-btn variant="tonal" size="large" class="mt-5">
                <h3>Connect Wallet</h3>
            </v-btn> -->
            <v-btn variant="tonal" size="large" class="mt-5" to="/reconcile">
                <h3>Generate Report</h3>
            </v-btn>
            <v-btn variant="tonal" color="secondary" size="large" class="mt-5 ml-5" target="_blank"
                href="https://cryptoinvoicegenerator.io">
                <h3>Generate Invoice</h3>
            </v-btn><br><br>
            <small>Build by the <a style="text-decoration: none; color: black;" href="https://equil.io">EQUIL</a>
                team</small>
        </v-col>
        <v-col cols="12" lg="6">
            <div class="pa-4 pl-1">
                <HeroDark style=" width: 100%" v-if="!customizer.darktheme && customizer.navbarColor == '#ffffff'" />
                <HeroLight style="width: 100%" v-else />
            </div>
            <!-- <img style="width: 100%; padding-bottom: 20px;" src="@/assets/images/hero.png" /> -->
        </v-col>
        <v-col cols="12" lg="12">
            <v-card class="pa-5 mt-5">
                <v-row>
                    <v-col cols="12" lg="12">
                        <h1>The Easy Way to Track Your XRP Transactions!</h1>
                        <h4>Are you in Australia and want to stay compliant with financial and tax regulations when it comes
                            to
                            your XRP transactions?</h4><br>
                        <p>
                            Look no further! X-SQUARED is a user-friendly web application designed just
                            for you.<br><br>

                            As cryptocurrency gains popularity, more people and businesses are using XRP for their
                            transactions.
                            With X-SQUARED, you can effortlessly account for your XRP transactions while ensuring you meet
                            all
                            the necessary requirements for Capital Gains, GST, and Assets/Liabilities.<br><br>

                            Our platform is tailored specifically for XRP transactions, making it the perfect choice for
                            individuals and businesses in emerging markets who want to transact on the blockchain. Stay
                            ahead of
                            the game and simplify your XRP accounting with X-SQUARED!<br><br>

                            Sign up now and take control of your XRP transactions with ease </p>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
    </v-row>
</template>