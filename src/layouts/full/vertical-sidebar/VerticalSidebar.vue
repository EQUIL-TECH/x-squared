<script setup lang="ts">
import { ref, watch } from "vue";
import { useCustomizerStore } from "@/stores/customizer";
import sidebarItems from "./sidebarItem";
import { saveDarkModeSetting, darkMode } from "@/stores/settings";
// import { saveTestNetSetting, netName, testNet } from "@/xrplservice/storage";


const customizer = useCustomizerStore();
const sidebarMenu = ref(sidebarItems);

function persistDarkMode() {
  saveDarkModeSetting();
  customizer.darktheme = darkMode.value;

}

</script>

<template>
  <v-navigation-drawer left :permanent="$vuetify.display.mdAndUp" v-model="customizer.Sidebar_drawer" elevation="10"
    :class="customizer.SidebarColor == 'white' ? '' : 'text-white'"
    :color="customizer.darktheme ? '' : customizer.SidebarColor" rail-width="75" mobile-breakpoint="960" app
    :rail="customizer.mini_sidebar" expand-on-hover>
    <!-- ---------------------------------------------- -->
    <!---Navigation -->
    <!-- ---------------------------------------------- -->
    <perfect-scrollbar class="scrollnavbar">
      <v-divider />
      <v-list class="pa-3">
        <!-- ---------------------------------------------- -->
        <!---Menu Loop -->
        <!-- ---------------------------------------------- -->

        <!-- ---------------------------------------------- -->
        <!---Single Item-->
        <!-- ---------------------------------------------- -->
        <v-list-item v-for="(item, i) in sidebarMenu" :to="item.to" rounded="lg" class="mb-1">
          <template v-slot:prepend>
            <vue-feather :type="item.icon" class="feather-sm v-icon v-icon--size-default"></vue-feather>
          </template>
          <v-list-item-title v-text="item.title"></v-list-item-title>
        </v-list-item>
        <!-- ---------------------------------------------- -->
        <!---End Single Item-->
        <!-- ---------------------------------------------- -->

        <!-- <v-switch class="pl-3" hide-details v-model="darkMode" label="Dark Mode"
          @change="persistDarkMode"></v-switch><br /> -->
      </v-list>
      <!-- ---------------------------------------------- -->
      <!---DARK MODE SWITCH-->
      <!-- ---------------------------------------------- -->
      <v-switch prepend-icon="mdi-theme-light-dark" inset class="pl-5" hide-details v-model="darkMode"
        @change="persistDarkMode"></v-switch>
    </perfect-scrollbar>
    <v-btn variant="tonal" rounded="0" block>
      <h3>VISIT EQUIL</h3>
    </v-btn>
  </v-navigation-drawer>
</template>
