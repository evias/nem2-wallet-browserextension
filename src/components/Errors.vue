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
    <div
      v-if="accountInfo.loading_getAccountInfo"
      class="mt-3 mb-3"
    >
      <v-progress-linear
        :indeterminate="true"
      />
    </div>
    <div v-if="wallet.wallets.length === 0">
      <v-alert
        :value="true"
        type="info"
        style="text-align:center"
      >
        <v-btn
          to="/wallet"
          color="white"
        >
          No wallets configured, create one now!
        </v-btn>
      </v-alert>
    </div>

    <div v-if="wallet.wallets.length > 0">
      <div v-if="!wallet.activeWallet">
        <v-alert
          :value="true"
          type="error"
        >
          Please select a wallet
        </v-alert>
      </div>

      <div v-if="wallet.activeWallet">
        <div v-if="application.error">
          <v-alert
            :value="true"
            type="error"
          >
            {{ application.errorMessage }}
          </v-alert>
        </div>
        <div v-if="application.listenerStatus === 'error'">
          <v-alert
            :value="true"
            type="error"
          >
            {{ application.listenerErrorMessage }}
          </v-alert>
        </div>
      </div>
    </div>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Errors',
  computed: mapState([
    'wallet',
    'accountInfo',
    'application',
  ]),
};
</script>

<style scoped>
</style>
