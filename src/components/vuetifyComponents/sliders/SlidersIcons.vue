<script setup lang="ts">
import { ref } from "vue";

const media = ref(0);
const alarm = ref(0);
const zoom = ref(0);

function zoomOut() {
  zoom.value = zoom.value - 10 || 0;
}
function zoomIn() {
  zoom.value = zoom.value + 10 || 100;
}
</script>

<template>
  <!-- ----------------------------------------------------------------------------- -->
  <!-- SlidersIcons -->
  <!-- ----------------------------------------------------------------------------- -->
  <div>
    <p class="text-subtitle-1 text-grey-darken-1">
      You can add icons to the slider with the <code>append-icon</code> and
      <code>prepend-icon</code> props. With <code>@click:append</code> and
      <code>@click:prepend</code> you can trigger a callback function when click
      the icon.
    </p>
    <div class="mt-4">
      <v-subheader>Media volume</v-subheader>
      <v-card-text>
        <v-slider v-model="media" prepend-icon="mdi-volume-high"></v-slider>
      </v-card-text>

      <v-subheader>Alarm volume</v-subheader>

      <v-card-text>
        <v-slider v-model="alarm" append-icon="mdi-alarm"></v-slider>
      </v-card-text>

      <v-subheader>Icon click callback</v-subheader>

      <v-card-text>
        <v-slider
          v-model="zoom"
          append-icon="mdi-magnify-plus-outline"
          prepend-icon="mdi-magnify-minus-outline"
          @click:append="zoomIn"
          @click:prepend="zoomOut"
        ></v-slider>
      </v-card-text>
    </div>
  </div>
</template>
