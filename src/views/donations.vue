<script setup lang="ts">
import { ref, watch } from "vue";
import { useCustomizerStore } from "@/stores/customizer";
import LogoLight from "@/layouts/full/logo/LogoLight.vue";
import LogoDark from "@/layouts/full/logo/LogoDark.vue";

const customizer = useCustomizerStore();

</script>

<template >
    <v-row class="h-100vh">
        <v-col cols="12" lg="6" xl="6" class="bg-black d-none d-md-flex align-center justify-center">
            <v-container>
                <div class="pa-10">
                    <v-row justify="center">
                        <v-col cols="8" xl="8">
                            <div>
                                <img style="width: 70%; padding-bottom: 20px;"
                                    src="@/assets/images/logos/white-logo-text.svg" />
                            </div>
                            <h1>Crypto Fiat Invoices made easy!</h1>
                            <p>Built by the EQUIL dev team</p>
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
                            <h1>Love the app? Want to donate?</h1>
                            <p>Help us continue to make useful decentralised applications</p>
                            <table class="mt-3">
                                <tr>
                                    <td><strong>ETH</strong></td>
                                    <td>ADDRESS</td>
                                </tr>
                                <tr>
                                    <td><strong>BTC</strong></td>
                                    <td>ADDRESS</td>
                                </tr>
                                <tr>
                                    <td><strong>XRP</strong></td>
                                    <td>ADDRESS</td>
                                </tr>
                            </table>
                            <v-btn class="mt-5" style="color: #ffffff" to="/">
                                <h3>Go back to App</h3>
                            </v-btn>
                        </v-col>
                    </v-row>
                </div>
            </v-container>
        </v-col>
    </v-row>
</template>

<!-- <style lang="scss">
.hero {
    background-repeat: no-repeat;
    background: url("@/assets/images/background/hero.png");
    background-size: cover;
}
</style> -->