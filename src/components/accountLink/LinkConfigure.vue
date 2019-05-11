<template>
  <v-scale-transition>
    <v-layout column>

      <v-layout row>
        <v-flex xs3>
          <v-subheader>Link Action</v-subheader>
        </v-flex>
        <v-flex xs7>
          <v-radio-group
                  v-model="linkAction"
                  row
          >
            <v-radio
                    v-for="l in linkActions"
                    :key="l.type"
                    :label="l.label"
                    :value="l.type"
            />
          </v-radio-group>
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-flex xs3>
          <v-subheader>Remote Account Public Key</v-subheader>
        </v-flex>
        <v-flex xs7>
          <v-text-field
                  class="ma-0 pa-0"
                  label="Account Public Key"
                  solo
                  v-model="remoteAccountKey"
                  required
          />
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-flex xs3>
          <v-subheader>Max Fee</v-subheader>
        </v-flex>
        <v-flex xs7>
          <v-text-field
                  class="ma-0 pa-0"
                  label="Account Public Key"
                  solo
                  v-model="maxFee"
                  required
          />
        </v-flex>
      </v-layout>

      <v-layout
              row
              justify-center
              align-center
      >
        <v-btn
                style="margin-bottom: 20px"
                color="gray"
                :disabled="disabledSendTransaction"
                depressed
                @click="showDialog"
        >
          Send Transaction
        </v-btn>
      </v-layout>

      <v-layout column>
        <SendConfirmation
                :tx-send-data="txSendResults"
        />
      </v-layout>

      <Dialog
              v-model="isDialogShow"
              :transaction="transaction"
              @sent="txSent"
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
    </v-layout>

  </v-scale-transition>
</template>
<script>
import {
  LinkAction,
  AccountLinkTransaction,
  Deadline,
  NetworkType,
  UInt64,
} from 'nem2-sdk';
import SendConfirmation from './SendConfirmation.vue';
import Dialog from './Dialog.vue';

export default {
  components: {
    Dialog,
    SendConfirmation,
  },
  data() {
    return {
      maxFee: 0,
      remoteAccountKey: 'F95DE849EA383A05F128DA22FD3801D83B1327A86959BB9EC53DBBEDE3AEE488',
      linkAction: LinkAction.Link,
      linkActions: [
        {
          label: 'Link',
          type: LinkAction.Link,
        }, {
          label: 'Unlink',
          type: LinkAction.Unlink,
        },
      ],
      isDialogShow: false,
      dialogDetails: [],
      transaction: {},
      txSendResults: [],
    };
  },
  computed: {
    disabledSendTransaction() {
      return this.linkAction === -1 || this.remoteAccountKey === '';
    },
  },
  methods: {
    showDialog() {
      const { linkAction, remoteAccountKey } = this;
      this.transaction = new AccountLinkTransaction(
        NetworkType.MIJIN_TEST,
        2,
        Deadline.create(),
        UInt64.fromUint(this.maxFee),
        remoteAccountKey,
        linkAction,
      );
      this.dialogDetails = [
        {
          icon: 'add',
          key: 'Link Action',
          value: this.linkAction === 1 ? 'Unlink' : 'Link',
        },
        {
          icon: 'add',
          key: 'Account Public Key',
          value: this.remoteAccountKey,
        },
        {
          icon: 'add',
          key: 'Max Fee',
          value: this.maxFee,
        },
      ];
      this.isDialogShow = true;
    },
    txSent(result) {
      this.txSendResults.push({
        txHash: result.txHash,
        nodeURL: result.nodeURL,
      });
    },
  },
};
</script>
<style scoped>
</style>
