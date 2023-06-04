<script setup lang="ts">
import { ref } from "vue";

const expand = ref(false);
const expand2 = ref(false);
const expand3 = ref(false);
const expand4 = ref(false);

const scores = ref([
  { score: "Peak", value: "64" },
  { score: "Wellness", value: "83" },
  { score: "Physical", value: "83" },
  { score: "Load", value: "400" },
]);

const training = ref([
  { type: "Recovery", notes: "Easy 5km Jog" },
  { type: "Rehab", notes: "As per new rehab program" },
]);

const performance = ref([
  { title: "100m PB", notes: "10.32s" }
]);
</script>

<template>
  <!-- ----------------------------------------------------------------------------- -->
  <!-- Weather -->
  <!-- ----------------------------------------------------------------------------- -->
  <v-card class="mx-auto" variant="elevated">

    <v-card-item>
      <template v-slot:subtitle>
        23 February 2023
      </template>
      <h1>64</h1>
      <p>Peak Score</p> 
    </v-card-item>

    <!-- CYCLE PHASE (only appears if user is a female)-->

    <div class="d-flex justify-start pa-3">
      <v-progress-circular color="error" model-value="3" max="30"></v-progress-circular>
      <p style="padding-left: 10px;">Luteal Phase <strong>Day 3</strong></p>
    </div>

        <!-- REPORT TOGGLES -->

        <v-row class="justify-start">
        <v-col>
        <v-card-actions style="padding-bottom: 10px; padding-left: 16px">
          <v-btn color="primary" variant="tonal" @click="expand = !expand">
            <h4>{{ !expand ? "Scores" : "Hide Scores" }}</h4>
          </v-btn>

          <v-btn color="primary" variant="tonal" @click="expand2 = !expand2">
           <h4>{{ !expand2 ? "Training" : "Hide Training" }}</h4>
          </v-btn>

          <v-btn color="primary" variant="tonal" @click="expand3 = !expand3">
            <h4>{{ !expand3 ? "Performances" : "Hide Performances" }}</h4>
          </v-btn>
        </v-card-actions>
      </v-col>

      <!-- Comments and likes section -->
      <v-col>
        <div class="ma-3 d-flex flex-wrap gap-2 justify-end">
          <v-btn size="x-small" icon color="dark"><vue-feather type="heart"></vue-feather></v-btn>

          <v-btn
            size="x-small" icon color="dark" @click="expand4 = !expand4">          
            <v-badge color="error" dot><vue-feather type="message-circle"></vue-feather>
            </v-badge>
        </v-btn>

          </div>

      </v-col>
    </v-row>

    <!-- DAILY SCORES -->

    <v-expand-transition>
      <div v-if="expand">

        <v-list class="bg-primary pa-2">
          <h3 style="color: white;" class="pa-4">Scores</h3>
          <v-divider></v-divider>
          <v-list-item
            v-for="item in scores"
            :key="item.score"
            :title="item.score"
            :subtitle="item.value"
          >
          </v-list-item>
        </v-list>
      </div>
    </v-expand-transition>

    <!-- TRAINING -->

    <v-expand-transition>
      <div v-if="expand2">
        <v-list class="bg-primary pa-2">
          <h3 style="color: white;" class="pa-4">Training</h3>
          <v-divider></v-divider>
          <v-list-item
            v-for="item in training"
            :key="item.type"
            :title="item.type"
            :subtitle="item.notes"
          >
          </v-list-item>
        </v-list>
      </div>
    </v-expand-transition>

    <!-- PERFORMANCES -->

    <v-expand-transition>
      <div v-if="expand3">
        <v-list class="bg-primary pa-2">
          <h3 style="color: white;"  class="pa-4">Performances</h3>
          <v-divider></v-divider>
          <v-list-item
            v-for="item in performance"
            :key="item.title"
            :title="item.title"
            :subtitle="item.notes"
          >
          </v-list-item>
        </v-list>
      </div>
    </v-expand-transition>

    <v-expand-transition>
      <div v-if="expand4">
        <v-list class="bg-transparent pa-2">
          <h5 class="pa-4">Comments go below</h5>
          <v-divider></v-divider>
          <v-list-item>This is where comments will be listed.</v-list-item>
        </v-list>
      </div>
    </v-expand-transition>

  </v-card>
</template>
