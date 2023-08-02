<!-- AccountComponent.vue -->
<script lang="ts">
import { defineComponent, type PropType } from 'vue';

export default defineComponent({

    data() {
        return {
        };
    },

    props: {
        account: String,
        userAccount: String,
    },

});


</script>


"localhost:3001/?account=rGNMLvzrDebrJxA1uY5J1xW5uBmnHqCMhn"

<template>
    <div v-if="account === null">
        <!-- RED is BURNED -->
        <v-chip size="x-small" class="ma-2" color="red" prepend-icon="mdi-alpha-x-circle">BURNED</v-chip>
    </div>
    <div v-else-if="userAccount === account">
        <!-- Blue is my account -->
        <router-link :to="`/?account=${account}`" class="link">
            <v-chip size="x-small" class="ma-2" color="purple" prepend-icon="mdi-checkbox-marked-circle">{{ account
            }}</v-chip>
        </router-link>
    </div>
    <!-- <div v-else-if="userAccount === account">
        <router-link :to="`/?account=${account}`" class="link">
            <v-chip link class="ma-2" color="green" prepend-icon="mdi-hand-coin">{{ account }}</v-chip>
        </router-link>
    </div> -->
    <div v-else>
        <!-- Other persons account -->
        <router-link :to="`/?account=${account}`" class="link">
            <v-chip size="x-small" class="ma-2" color="primary" prepend-icon="mdi-account">{{ account }}</v-chip>
        </router-link>
    </div>
</template>




<style scoped>
.link {
    cursor: pointer;
    /* @tori can you help with this */
}
</style>

