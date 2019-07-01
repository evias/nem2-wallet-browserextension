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
  <v-dialog
    v-model="show"
    max-width="680px"
  >
    <v-card>
      <v-card-title primary-title>
        <h3 class="headline mb-3">
          {{ $t('Manage-your-connection-endpoint') }}
        </h3>
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="wallet.activeWallet.node"
          class="ma-0 pa-0"
          :label="$t('Wallet-default-node')"
          type="text"
          disabled
        />
        <v-text-field
          v-model="application.activeNode"
          class="ma-0 pa-0"
          :label="$t('Current-node')"
          type="text"
          disabled
        />
        <v-text-field
          v-model="newActiveNode"
          class="mt-4 ma-0 pa-0"
          :label="$t('New-node')"
          type="text"
        />
        <v-select
          v-if="application.officialNodes"
          v-model="selectedOfficialNode"
          :items="application.officialNodes"
          class="ma-0 pa-0"
          :label="$t('Pick-a-node-from-the-official-list')"
          @input="afterselection"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          flat
          @click.stop="$emit('close')"
        >
          close
        </v-btn>
        <v-btn
          flat
          @click.stop="setNewActiveNode"
        >
          {{ $t('Change-your-current-node') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex';
import store from '../../store/index';

export default {
  name: 'Nodes',
  store,
  props: {
    visible: Boolean,
  },
  data() {
    return {
      newActiveNode: '',
      selectedOfficialNode: null,
    };
  },
  computed: {
    ...mapState([
      'wallet',
      'application',
    ]),
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit('close');
        }
      },
    },
  },
  methods: {
    setNewActiveNode() {
      store.dispatch('application/CHANGE_CURRENT_NODE', this.newActiveNode);
    },
    afterselection(e) {
      if (e) this.newActiveNode = e;
      this.selectedOfficialNode = [];
    },
  },
};
</script>
