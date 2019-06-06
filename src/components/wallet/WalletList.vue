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
  <v-layout column>
    <v-list
      v-if="wallet.wallets.length > 0"
      two-line
      class="py-0"
    >
      <v-slide-y-transition
        group
        tag="v-list"
        class="py-0"
      >
        <template v-for="(wallet, index) in wallet.wallets">
          <v-list-tile
            :key="wallet.name"
            avatar
            ripple
          >
            <v-list-tile-content class="my-2">
              <v-list-tile-title>{{ wallet.name }}</v-list-tile-title>
              <div v-if="!wallet.isWatchOnly">
                <v-list-tile-sub-title class="monospaced-bold">
                  {{ wallet.account.address.pretty() }}
                </v-list-tile-sub-title>
              </div>
              <div v-if="wallet.isWatchOnly">
                <v-list-tile-sub-title class="monospaced-bold">
                  {{ wallet.publicAccount.address.pretty() }}
                </v-list-tile-sub-title>
              </div>

              <v-list-tile-sub-title class="monospaced">
                {{ wallet.node }}
              </v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn
                icon
                ripple
                @click="removeWallet(wallet.name)"
              >
                <v-icon color="grey lighten-1">
                  delete_forever
                </v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider
            v-if="index + 1 < wallet.walletsNumber"
            :key="index"
          />
        </template>
      </v-slide-y-transition>
    </v-list>
  </v-layout>
</template>
<script>
import { mapState } from 'vuex';
import store from '../../store/index';

export default {
  name: 'WalletList',
  store,
  computed: mapState([
    'wallet',
  ]),
  methods: {
    removeWallet(walletName) {
      this.$store.dispatch('wallet/REMOVE_WALLET', walletName);
    },
  },
};
</script>

<style scoped>
</style>
