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
  <v-scale-transition>
    <v-layout
      column
      class="mb-3"
    >
      <v-layout row>
        <v-flex xs12>
          <v-subheader class="mb-3">
            <h3>Asset modification</h3>
          </v-subheader>
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-flex xs9>
          <v-text-field
            v-model="activeAsset"
            class="ma-0 pa-0"
            solo
            required
            disabled
          />
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-flex xs3>
          <v-subheader>Direction</v-subheader>
        </v-flex>
        <v-flex xs9>
          <v-select
            v-model="direction"
            :items="directions"
            solo
          />
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-flex xs3>
          <v-subheader>Supply (unit)</v-subheader>
        </v-flex>
        <v-flex xs9>
          <v-text-field
            v-model="supply"
            class="ma-0 pa-0"
            label="Supply (unit)"
            type="number"
            solo
            required
            number
          />
        </v-flex>
      </v-layout>

      <v-layout column>
        <SendConfirmation
          :tx-send-data="txSendResults"
        />
      </v-layout>
      <v-layout
        row
        justify-end
        align-center
      >
        <v-btn
          flat
          @click="$emit('closeComponent')"
        >
          Close
        </v-btn>
        <v-btn
          :disabled="disabledSendTransaction"
          color="primary mx-0"
          @click="showDialog"
        >
          Send Transaction
        </v-btn>
      </v-layout>
      <Dialog
        :is-show="isDialogShow"
        @transmitTransaction="modifyAsset"
        @close="dialogClosed"
      >
        <v-list>
          <v-list-tile
            v-for="detail in dialogDetails"
            :key="detail.key"
          >
            <v-list-tile-action>
              <v-icon>{{ detail.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ detail.key }}: {{ detail.value }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </Dialog>
      <v-divider />
    </v-layout>
  </v-scale-transition>
</template>

<script>
import { mapState } from 'vuex';
import {
  Deadline,
  MosaicId,
  MosaicSupplyChangeTransaction,
  MosaicSupplyType,
  NetworkType,
  TransactionHttp,
  UInt64,
} from 'nem2-sdk';

import Dialog from './Dialog.vue';
import SendConfirmation from './SendConfirmation.vue';

export default {
  name: 'AssetCreation',
  components: {
    Dialog,
    SendConfirmation,
  },
  props: {
    activeAsset: {
      type: String,
      default() {
        return '';
      },
    },
  },
  data() {
    return {
      supply: 1,
      dialogDetails: [],
      txSendResults: [],
      disabledSendTransaction: false,
      isDialogShow: false,
      direction: 'Increase',
      directions: ['Increase', 'Decrease'],
    };
  },
  computed: mapState([
    'wallet',
  ]),
  watch: {
    supply: {
      handler(e) {
        this.disabledSendTransaction = !(parseInt(e, 10) > 0);
      },
    },
  },
  methods: {
    showDialog() {
      this.dialogDetails = [
        {
          icon: 'add',
          key: 'Direction',
          value: this.direction,
        },
        {
          icon: 'add',
          key: 'Supply',
          value: this.supply,
        },
      ];
      this.isDialogShow = true;
    },
    modifyAsset() {
      if (!this.wallet.activeWallet) return;
      if (this.directions.indexOf(this.direction) === -1) return;

      const endpoint = this.wallet.activeWallet.node;
      const transactionHttp = new TransactionHttp(endpoint);
      // eslint-disable-next-line prefer-destructuring;
      const { account } = this.wallet.activeWallet;

      const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
        Deadline.create(),
        new MosaicId(this.activeAsset),
        MosaicSupplyType[this.direction],
        UInt64.fromUint(parseInt(this.supply, 10)),
        NetworkType.MIJIN_TEST,
      );

      const signedTx = account.sign(mosaicSupplyChangeTransaction);

      transactionHttp
        .announce(account.sign(mosaicSupplyChangeTransaction))
        // eslint-disable-next-line no-console
        .subscribe(x => console.log(x), err => console.error(err));

      this.txSendResults = [{
        txHash: signedTx.hash,
        nodeURL: endpoint,
      }];
    },
    dialogClosed() {
      this.isDialogShow = false;
      this.dialogDetails = [];
    },
  },

};

</script>

<style scoped>
</style>
