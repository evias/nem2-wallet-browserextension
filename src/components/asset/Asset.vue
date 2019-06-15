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
        v-if="wallet.wallets.length > 0
          && wallet.activeWallet
          && !application.error"
        style="height: auto;padding:0 !important"
        class="card--flex-toolbar"
      >
        <v-toolbar
          card
          prominent
        >
          <v-toolbar-title>Assets</v-toolbar-title>

          <v-spacer />

          <v-btn
            icon
            @click.stop="reloadList(wallet.activeWallet)"
          >
            <v-icon>refresh</v-icon>
          </v-btn>

          <v-btn
            icon
            :disabled="wallet.activeWallet.isWatchOnly"
            @click.stop="createAsset = true"
          >
            <v-icon>add_box</v-icon>
          </v-btn>
        </v-toolbar>

        <v-spacer />
        <v-card-text>
          <AssetCreation
            :visible="createAsset"
            @close="createAsset = false"
          />
          <AssetList :default-tab="1" />
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import { mapState } from 'vuex';
import store from '../../store/index';
import Errors from '../Errors.vue';
import AssetCreation from './AssetCreation.vue';
import AssetList from './AssetList.vue';

export default {
  name: 'Assets',
  store,
  components: {
    Errors,
    AssetCreation,
    AssetList,
  },
  data() {
    return {
      createAsset: false,
      reloadAssetNotifier: 0,
    };
  },
  computed: mapState([
    'wallet',
    'application',
    'assets',
  ]),
  methods: {
    reloadList(wallet) {
      this.$store.dispatch('assets/GET_ASSETS_BY_ADDRESS', { wallet });
    },
  },
};
</script>
<style scoped>
</style>
