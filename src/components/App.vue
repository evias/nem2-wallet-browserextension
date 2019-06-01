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
  <v-app :dark="application.darkMode">
    <v-content>
      <v-container grid-list-lg>
        <v-layout
          justify-start
          row
          xs12
          lg12
        >
          <v-flex
            shrink
            pa-0
          >
            <v-navigation-drawer
              v-model="drawer"
              fixed
              app
            >
              <v-list>
                <v-list-tile to="/">
                  <v-list-tile-action>
                    <v-icon>home</v-icon>
                  </v-list-tile-action>

                  <v-list-tile-content>
                    <v-list-tile-title>Home</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>

                <v-list-tile to="/transact">
                  <v-list-tile-action>
                    <v-icon>send</v-icon>
                  </v-list-tile-action>

                  <v-list-tile-content>
                    <v-list-tile-title>Transactions</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>

                <v-list-tile to="/namespace">
                  <v-list-tile-action>
                    <v-icon>dns</v-icon>
                  </v-list-tile-action>

                  <v-list-tile-content>
                    <v-list-tile-title>Namespaces</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>

                <v-list-tile to="/asset">
                  <v-list-tile-action>
                    <v-icon>group_work</v-icon>
                  </v-list-tile-action>

                  <v-list-tile-content>
                    <v-list-tile-title>Assets</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>

                <v-list-tile to="/multisig">
                  <v-list-tile-action>
                    <v-icon>keyboard_tab</v-icon>
                  </v-list-tile-action>

                  <v-list-tile-content>
                    <v-list-tile-title>Multisig</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>

              <v-divider />

              <v-list>
                <v-list-tile to="/developer-mode">
                  <v-list-tile-action>
                    <v-icon>gamepad</v-icon>
                  </v-list-tile-action>

                  <v-list-tile-content>
                    <v-list-tile-title>Developer mode</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>


                <v-list-tile to="/about">
                  <v-list-tile-action>
                    <v-icon>info</v-icon>
                  </v-list-tile-action>

                  <v-list-tile-content>
                    <v-list-tile-title>About</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-navigation-drawer>
            <v-toolbar
              fixed
              app
            >
              <v-toolbar-side-icon @click.stop="drawer = !drawer" />
              <v-toolbar-title>{{ application.routeName }}</v-toolbar-title>
              <v-spacer />
              <WalletSelector
                :wallet-name="wallet.activeWallet.name || ''"
                :wallets="wallet.wallets.map(({name})=>name) || []"
              />
            </v-toolbar>
          </v-flex>
          <v-flex
            grow
            pl-3
            ml-2
          >
            <router-view />
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer
      height="auto"
      app
    >
      <v-card
        flat
        tile
        class="text-xs-center width-100"
        app
      >
        <v-card-text
          class="red--text"
          pa-1
        >
          Please be aware this is a Wallet for development proposes,&nbsp;
          it has no security and the private keys are stored in plain text.
          <strong>DO NOT USE IN MAIN NET or PRODUCTION PRIVATE NETWORKS</strong>
        </v-card-text>

        <v-divider />

        <v-card-text class="padding-0">
          <v-btn
            pt-1
            pr-4
            pb-1
            pl-4
            icon
            href="https://github.com/decentraliser/nem2-wallet-browserextension"
            target="_new"
          >
            Github
          </v-btn>
          <v-btn
            pt-1
            pr-4
            pb-1
            pl-4
            icon
            href="https://nem2.slack.com/"
            target="_new"
          >
            Slack
          </v-btn>
          <strong>NEM2 (Cow) Wallet v0.1.1alpha</strong>
        </v-card-text>
      </v-card>
    </v-footer>
    <v-snackbar
      v-model="snackbar"
      :multi-line="true"
      :right="true"
      :bottom="true"
      :timeout="8000"
      :vertical="false"
    >
      {{ snackbarText }}
      <v-btn
        flat
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </v-app>
</template>
<script>
import { mapState } from 'vuex';
import store from '../store/index';
import WalletSelector from './WalletSelector.vue';

export default {
  components: {
    WalletSelector,
  },
  store,
  data() {
    return {
      drawer: true,
      right: null,
      snackbar: false,
      snackbarText: '',
    };
  },
  computed: {
    ...mapState([
      'wallet',
      'application',
    ]),
  },
  created() {
    this.$store.dispatch('wallet/INIT_APPLICATION');
  },
  mounted() {
    store.subscribeAction((action) => {
      if (action.type === 'application/SET_SNACKBAR_TEXT') {
        this.snackbarText = `${action.payload.text}`;
        this.snackbar = true;
      }
    });
  },
};
</script>
