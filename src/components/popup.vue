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
// along with nem2-wallet-browserextension.  If not, see <http://www.gnu.org/licenses/>.

<template>
  <v-app>
    <v-content>
      <v-container fluid>
        <div class="fixedHeightContainer">
          <v-layout
            align-center
            justify-center
            column
            fill-height
          >
            <h5 class="headline">
              NEM2 Wallet
            </h5>
            <v-btn
              color="primary"
              dark
              href="wallet.html"
              target="_blank"
              @click="closePopup"
            >
              Open Wallet
            </v-btn>
          </v-layout>
        </div>
      </v-container>
    </v-content>
  </v-app>
</template>
<script>
export default {
  methods: {
    closePopup: (event) => {
      setTimeout(() => window.close(), 50);
    },
  },
};
</script>
