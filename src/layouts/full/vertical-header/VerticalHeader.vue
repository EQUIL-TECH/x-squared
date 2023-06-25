<script setup lang="ts">
import { ref } from "vue";
import { useCustomizerStore } from "../../../stores/customizer";
// import IconLight from "@/layouts/full/icon/IconLight.vue";
// import IconDark from "@/layouts/full/icon/IconDark.vue";
import { saveDarkModeSetting, darkMode } from "@/stores/settings";
import { RouterLink } from "vue-router";

const customizer = useCustomizerStore();

const priority = ref(customizer.setHorizontalLayout ? 0 : 0);
// import { saveTestNetSetting, netName, testNet } from "@/xrplservice/storage";


function persistDarkMode() {
  saveDarkModeSetting();
  customizer.darktheme = darkMode.value;

}



</script>

<template>
  <v-app-bar :color="customizer.darktheme ? '' : customizer.navbarColor" elevation="10" :priority="priority" :class="[
    'v-topbar px-4',
    customizer.navbarColor == '#ffffff' ? '' : 'text-white',
  ]">
    <!-- ---------------------------------------------- -->
    <!---Logo part -->
    <!-- ---------------------------------------------- -->
    <div class="pa-4 pl-1 d-flex" style="width: 200px">
      <!-- <div class="pa-4 pl-1">
        <IconDark style=" width: 100%" v-if="!customizer.darktheme && customizer.navbarColor == '#ffffff'" />
        <IconLight style=" width: 100%" v-else />
      </div> -->
      <a href="/" style="text-decoration: none; color: black;">
        <h2>X-SQUARED</h2>
      </a>
      <!-- <LogoDark style="width: 100%" v-if="!customizer.darktheme && customizer.navbarColor == '#ffffff'" />
      <LogoLight style="width: 100%" v-else /> -->
    </div>
    <!-- <v-app-bar-nav-icon class="hidden-sm-and-down" color="inherit"
      @click.stop="customizer.SET_MINI_SIDEBAR(!customizer.mini_sidebar)" />
    <v-app-bar-nav-icon class="hidden-md-and-up" color="inherit" @click.stop="customizer.SET_SIDEBAR_DRAWER" /> -->

    <v-spacer />

    <!-- ---------------------------------------------- -->
    <!---right part -->
    <!-- --------------------------------------------- -->
    <div class="d-flex align-center">
      <v-switch prepend-icon="mdi-theme-light-dark" inset class="pl-5 pr-5" hide-details v-model="darkMode"
        @change="persistDarkMode"></v-switch>
      <!-- <v-btn variant="tonal" to="/donations">DONATE</v-btn> -->
    </div>
  </v-app-bar>
</template>
