<script setup lang="ts"></script>

<template>
  <!-- ----------------------------------------------------------------------------- -->
  <!-- One column width  -->
  <!-- ----------------------------------------------------------------------------- -->
  <v-container class="bg-surface-variant">
    <v-row no-gutters>
      <v-col>
        <v-sheet class="pa-2 ma-2"> .v-col-auto </v-sheet>
      </v-col>

      <v-col cols="6">
        <v-sheet class="pa-2 ma-2"> .v-col-6 </v-sheet>
      </v-col>

      <v-col>
        <v-sheet class="pa-2 ma-2"> .v-col-auto </v-sheet>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col>
        <v-sheet class="pa-2 ma-2"> .v-col-auto </v-sheet>
      </v-col>

      <v-col cols="2">
        <v-sheet class="pa-2 ma-2"> .v-col-2 </v-sheet>
      </v-col>

      <v-col>
        <v-sheet class="pa-2 ma-2"> .v-col-auto </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>
