<template>
  <v-layout
    column
    xs12
  >
    <v-layout
      row
      mb-4
    >
      <v-layout
        row
        fill-height
        justify-start
        pl-3
        xs3
      />
      <v-layout
        row
        fill-height
        justify-end
        xs9
      />
    </v-layout>
    <v-card
      v-if="wallet.wallets.length > 0
        && wallet.activeWallet"
      style="height: auto;padding:0 !important"
      class="card--flex-toolbar"
    >
      <v-toolbar
        card
        prominent
      >
        <v-toolbar-title>Link or Unlink an account</v-toolbar-title>
      </v-toolbar>
      <Errors class="mb-4" />
      <div
        v-if="wallet.wallets.length > 0
          && wallet.activeWallet
          && !application.error"
      >
        <LinkConfigure />
      </div>
    </v-card>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex';
import LinkConfigure from './LinkConfigure.vue';
import Errors from '../Errors.vue';

export default {
  name: 'AccountLink',
  components: {
    LinkConfigure,
    Errors,
  },
  data() {
    return {
    };
  },
  computed: mapState([
    'wallet',
    'application',
    'assets',
  ]),
  methods: {
  },
};
</script>

<style scoped>
</style>
