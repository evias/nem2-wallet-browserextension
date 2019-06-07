<template>
  <v-dialog
    :value="value"
    :max-width="maxWidth"
    @input="toggleDialog"
  >
    <v-card>
      <v-card-title primary-title>
        <h3 class="headline mb-0">
          {{ title }}
        </h3>
        <div>
          {{ body }}
        </div>
      </v-card-title>
      <v-card-text>
        <slot />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="secondary"
          @click="toggleDialog"
        >
          Cancel
        </v-btn>
        <v-btn
          color="info"
          @click="signAndAnnounce"
        >
          Yes, send it!
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex';
import request from 'request';

export default {
  name: 'Dialog',
  props: {
    value: {
      type: Boolean,
      default() {
        return false;
      },
    },
    transaction: {
      type: Object,
      default() {
        return {};
      },
    },
    title: {
      type: String,
      default() {
        return 'Send this transaction?';
      },
    },
    body: {
      type: String,
      default() {
        return 'Are you sure you want to send the the transaction with the following details?';
      },
    },
    maxWidth: {
      type: Number,
      default() {
        return 500;
      },
    },
  },
  computed: {
    ...mapState([
      'wallet',
      'application',
    ], {
      wallet: state => state.wallet,
      application: state => state.application,
    }),
  },
  methods: {
    toggleDialog() {
      this.$emit('input', !this.value);
    },
    signAndAnnounce() {
      const { activeWallet } = this.wallet;
      const endpoint = this.application.activeNode;
      const { account } = activeWallet;
      const signedTx = account.sign(this.transaction);
      const preSignedTxPayload = signedTx.payload;
      const signedTxPayload = `99000000${preSignedTxPayload.substr(8)}`;
      request({
        url: `${endpoint}/transaction`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        json: { payload: signedTxPayload },
      });
      this.toggleDialog();
      this.$emit('sent', {
        message: 'success',
        txHash: signedTx.hash,
        nodeURL: endpoint,
      });
    },
  },
};
</script>
