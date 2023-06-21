<script setup lang="ts">
import { ref, watch } from "vue";
import { useCustomizerStore } from "@/stores/customizer";
import LogoLight from "@/layouts/full/logo/LogoLight.vue";
import LogoDark from "@/layouts/full/logo/LogoDark.vue";

const customizer = useCustomizerStore();

</script>

<template >
    <v-row class="h-100vh hero">
        <v-col cols="12" lg="6" xl="6" class="bg-black d-none d-md-flex align-center justify-center">
            <v-container>
                <div class="pa-10">
                    <v-row justify="center">
                        <v-col cols="8" xl="8">
                            <div>
                                <img style="width: 70%; padding-bottom: 20px;"
                                    src="@/assets/images/logos/white-logo-text.svg" />
                            </div>
                            <p>Built on the XRP Ledger</p>
                        </v-col>
                    </v-row>
                </div>
            </v-container>
        </v-col>
        <v-col cols="12" lg="6" xl="6" class="d-flex align-center">
            <v-container>
                <div class="pa-7 pa-sm-12">
                    <v-row>
                        <v-col cols="12" lg="10" xl="8">
                            <div class="hidden-md-and-up">
                                <img style="width: 40%; padding-bottom: 20px;"
                                    src="@/assets/images/logos/dark-logo-text.svg" />
                            </div>
                            <h3 style="color: #26A9E1">WELCOME TO THE PARADIGM SHIFT</h3>
                            <h1>MINT, TRADE & EARN</h1>
                            <h4>Athletes, Coaches & Fans can mint Performance NFTs and earn EQ tokens for community
                                engagement.</h4><br>
                            <v-alert icon="mdi-information-variant" color="primary" variant="tonal">To mint & trade on this
                                platform, please download the <a class="text-bold text-primary"
                                    style="text-decoration: none;" href="https://xumm.app" target="_blank"><strong>XUMM
                                        app.</strong></a></v-alert>
                            <v-alert class="mt-5" icon="mdi-alert" color="dark" variant="tonal">This
                                platform is currently operating on the <strong>XRP ledger Testnet</strong>. There is no cost
                                to begin. Mainnet launch information to be launch soon... </v-alert>
                            <v-btn class="mt-10" to="/dashboard">
                                <h3>ENTER APP</h3>
                            </v-btn>
                        </v-col>
                    </v-row>
                </div>
            </v-container>
        </v-col>
    </v-row>
</template>
<style lang="scss">
.hero {
    background-repeat: no-repeat;
    background: url("@/assets/images/background/hero.png");
    background-size: cover;
}
</style>