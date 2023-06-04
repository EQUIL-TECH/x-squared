<script setup lang="ts">
import { RouterView } from "vue-router";
// import VerticalSidebarVue from "./vertical-sidebar/VerticalSidebar.vue";
import VerticalHeaderVue from "./vertical-header/VerticalHeader.vue";
import Customizer from "./customizer/Customizer.vue";
import { useCustomizerStore } from "@/stores/customizer";
const customizer = useCustomizerStore();
</script>

<template>
  <v-app :theme="customizer.darktheme ? 'dark' : 'light'" :class="[
    customizer.mini_sidebar ? 'mini-sidebar' : '',
    customizer.setHorizontalLayout ? 'horizontalLayout' : 'verticalLayout',
  ]">
    <Customizer />
    <VerticalHeaderVue v-if="!customizer.setHorizontalLayout" />
    <!-- <VerticalSidebarVue v-if="!customizer.setHorizontalLayout" /> -->

    <v-main>
      <v-container fluid class="page-wrapper">
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>
