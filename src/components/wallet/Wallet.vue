// Copyright (C) 2019 Contributors as noted in the AUTHORS file
//
// This file is part of nem2-wallet-browserextension.
//
// nem2-wallet-browserextension is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// nem2-wallet-browserextension is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with nem2-wallet-browserextension.  If not, see http://www.gnu.org/licenses/.

<template>
  <v-layout
    row
    pb-2
    mt-4
  >
    <v-flex
      xs12
    >
      <Errors class="mb-4" />

      <v-card
        style="height: auto;padding:0 !important"
        class="card--flex-toolbar"
      >
        <v-toolbar
          card
          prominent
        >
          <v-spacer />

          <v-btn
            flat
            @click.stop="showWalletCreationDialog = true"
          >
            New Wallet
          </v-btn>
          <v-spacer />

          <v-btn
            class="ml-3"
            flat
            @click.stop="showWoWalletCreationDialog = true"
          >
            New Watch-Only Wallet
          </v-btn>
          <v-spacer />

          <v-btn
            class="ml-3"
            flat
            @click.stop="showWalletImportDialog = true"
          >
            Import Wallet
          </v-btn>
          <v-spacer />
        </v-toolbar>

        <v-spacer />
        <v-card-text
          v-if="wallet.wallets.length > 0"
        >
          <WalletList class="my-2" />
        </v-card-text>
      </v-card>
    </v-flex>
    <WalletCreationDialog
      :visible="showWalletCreationDialog"
      @close="showWalletCreationDialog=false"
    />
    <WalletImportDialog
      :visible="showWalletImportDialog"
      @close="showWalletImportDialog=false"
    />
    <WoWalletCreationDialog
      :visible="showWoWalletCreationDialog"
      @close="showWoWalletCreationDialog=false"
    />
  </v-layout>
</template>
<script>
import { mapState } from 'vuex';
import WalletCreationDialog from './WalletCreationDialog.vue';
import WoWalletCreationDialog from './WoWalletCreationDialog.vue';
import WalletImportDialog from './WalletImportDialog.vue';
import WalletList from './WalletList.vue';
import Errors from '../Errors.vue';

export default {
  components: {
    WalletCreationDialog,
    WalletImportDialog,
    WoWalletCreationDialog,
    WalletList,
    Errors,
  },
  data() {
    return {
      showWoWalletCreationDialog: false,
      showWalletCreationDialog: false,
      showWalletImportDialog: false,
    };
  },
  computed: mapState(['wallet']),
};
</script>
<style scoped>
</style>
