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

<template>
  <v-layout
          column
          xs12
  >
    <v-flex
            xs12
    >
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
        <v-toolbar-title> Multisig actions</v-toolbar-title>
      </v-toolbar>

      <v-tabs fixed-tabs
              v-model="active"
              slider-color="primary"
      >
        <v-tab ripple>
          Multisig Info
        </v-tab>
        <v-tab ripple  :disabled="!(typeof multisigAccountInfo.account == 'undefined'
               ||!multisigAccountInfo.isMultisig())">
          Covert To Multisig
        </v-tab>
        <v-tab ripple>Modify Multisig</v-tab>
        <v-tab ripple>Cosign Multisign Transactions</v-tab>
        <v-tab-item>
          <v-card flat>
            <v-card flat>
              <MultisigAccountInfo :multisigAccountInfo="multisigAccountInfo"
              />
            </v-card >
          </v-card>
        </v-tab-item>

        <v-tab-item
        >
          <v-card flat>
            <MultisigConversion
                    @closeComponent="multisigConversion = false"
            />
          </v-card>
        </v-tab-item>

        <v-tab-item>
          <v-card flat>
            <MultisigModification
                    @closeComponent="multisigModification = false"
                    class="my-2"
                    :multisigAccountInfo="multisigAccountInfo"
            />
          </v-card>
        </v-tab-item>

        <v-tab-item
        >
          <v-card flat>
            <MultisigTransactions :multisigAccountInfo="multisigAccountInfo"
            />
          </v-card>
        </v-tab-item>
      </v-tabs>

    </v-card>
    <Errors />
    </v-flex>
  </v-layout>


</template>
<script>
import { mapState } from 'vuex';
import {
  AccountHttp,
  Address,
  NetworkType,
} from 'nem2-sdk';
import Errors from '../Errors.vue';
import MultisigConversion from './MultisigConversion.vue';
import MultisigModification from './MultisigModification.vue';
import MultisigAccountInfo from './MultisigAccountInfo.vue';
import MultisigTransactions from './MultisigTransactions.vue';

export default {
  components: {
    Errors,
    MultisigConversion,
    MultisigModification,
    MultisigTransactions,
    MultisigAccountInfo,
  },
  data() {
    return {
      multisigConversion: false,
      multisigModification: false,
      multisigAccountInfo: {},
      multisignTransactions: false,
      activeWallet: this.$store.getters['wallet/GET_ACTIVE_WALLET'],
    };
  },
  computed: {
    ...mapState([
      'wallet',
      'accountInfo',
      'application',
      'transactions',
      'assets',
      'namespaces',
    ], {
      wallet: state => state.wallet,
      assets: state => state.assets,
      namespaces: state => state.namespaces,
    }),
  },
  methods: {
    getMultisigTransactions() {
      this.multisignTransactions = !this.multisignTransactions;
    },
    covertToMultisig() {
      this.multisigConversion = !this.multisigConversion;
    },
    async reloadMultisignAccountInfo() {
      const { activeWallet } = this;
      const accountHttp = new AccountHttp(activeWallet.node);
      const addr = new Address(activeWallet.account.address.address, NetworkType.MIJIN_TEST);
      this.multisigAccountInfo = await accountHttp.getMultisigAccountInfo(addr).toPromise();
      this.$store.commit('multisig/SET_MULTISIGN', this.multisigAccountInfo.cosignatories);
      this.$store.commit('multisig/SET_COSIGNATORY', this.multisigAccountInfo.multisigAccounts);
    },
    modifyMultisig() {
      this.multisigModification = !this.multisigModification;
    },
  },
  async created() {
    const { activeWallet } = this;
    const accountHttp = new AccountHttp(activeWallet.node);
    const addr = new Address(activeWallet.account.address.address, NetworkType.MIJIN_TEST);
    this.multisigAccountInfo = await accountHttp.getMultisigAccountInfo(addr).toPromise();
    this.$store.commit('multisig/SET_MULTISIGN', this.multisigAccountInfo.cosignatories);
    this.$store.commit('multisig/SET_COSIGNATORY', this.multisigAccountInfo.multisigAccounts);
  },
};
</script>
<style scoped>
</style>
