<template>
  <div>
    <v-layout
      row
      wrap
    >
      <v-flex
        v-if="multisig.loading_getMultisigInfo"
        xs12
      >
        <v-progress-linear
          :indeterminate="true"
        />
      </v-flex>
    </v-layout>
    <v-layout
      row
      wrap
    >
      <v-flex
        v-if="typeof multisigAccountInfo.account === 'undefined'
          && !multisig.loading_getMultisigInfo"
        xs12
      >
        <v-card>
          <v-toolbar
            card
            prominent
          >
            <v-toolbar-title>{{ wallet.activeWallet.name }}: Multisig Information</v-toolbar-title>
            <v-spacer />

            <v-btn
              icon
              @click.stop="reloadMultisigInfo(wallet.activeWallet)"
            >
              <v-icon>refresh</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-title primary-title>
            <div class="monospaced">
              <div class="clearfix homeLine">
                this account is not a multisig nor a cosignatory
              </div>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>


      <v-flex
        v-if="typeof multisigAccountInfo.account !== 'undefined'
          && !multisig.loading_getMultisigInfo"
        xs12
      >
        <v-card>
          <v-toolbar
            card
            prominent
          >
            <v-toolbar-title>{{ wallet.activeWallet.name }}: Multisig Information</v-toolbar-title>
            <v-spacer />

            <v-btn
              icon
              @click.stop="reloadMultisigInfo(wallet.activeWallet)"
            >
              <v-icon>refresh</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-title primary-title>
            <div class="monospaced">
              <div class="clearfix homeLine">
                <div class="clearfix">
                  account public key:
                </div>
                <div class="clearfix">
                  {{ typeof multisigAccountInfo.account == 'undefined'
                    ?'':multisigAccountInfo.account.publicKey }}
                </div>
              </div>

              <div class="clearfix homeLine">
                <div class="clearfix">
                  min approval:
                </div>
                <div class="clearfix">
                  {{ multisigAccountInfo.minApproval }}
                </div>
              </div>

              <div class="clearfix homeLine">
                <div class="clearfix">
                  min removal:
                </div>
                <div class="clearfix">
                  {{ multisigAccountInfo.minRemoval }}
                </div>
              </div>

              <div class="clearfix homeLine">
                <div class="clearfix">
                  cosignatory list:
                </div>
                <div
                  v-for="(m, j) in multisigAccountInfo.cosignatories"
                  :key="j"
                  class="clearfix"
                >
                  {{ m.publicKey }}
                </div>
              </div>
              <div class="clearfix homeLine">
                <div class="clearfix">
                  multisig account list:
                </div>
                <div v-if="multisigAccountInfo.multisigAccounts.length == 0">
                  this account does not own any multisig account
                </div>
                <div
                  v-for="(m, i) in multisigAccountInfo.multisigAccounts"
                  v-else
                  :key="i"
                  class="clearfix"
                >
                  {{ m.publicKey }}
                </div>
              </div>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>

import { mapState } from 'vuex';
import { GET_MULTISIG_MODES } from '../../infrastructure/multisig/multisig-types';

export default {
  name: 'MultisigInfo',
  props: {
    multisigAccountInfo: {
      type: Object,
      default() {
        return undefined;
      },
    },
    loadingGetMultisigInfo: {
      type: Boolean,
      default() {
        return true;
      },
    },
  },
  computed: mapState([
    'wallet',
    'application',
    'multisig',
  ]),
  methods: {
    reloadMultisigInfo(wallet) {
      this.$store.dispatch('multisig/GET_MULTISIG_INFO', {
        wallet,
        mode: GET_MULTISIG_MODES.RELOAD,
      });
    },
  },
};

</script>
