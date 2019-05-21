<template>
  <v-layout
    column
    class="mt-2 mb-3"
  >
    <v-container>
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
      <v-layout row>
        <v-flex xs12>
          <v-select
            v-model="currentMultisigPublicKey"
            label="Multisig Account Publickey"
            :items="multisig.multisigInfo.multisigAccounts"
            item-text="publicKey"
          />
        </v-flex>
      </v-layout>
      <div v-if="aggregatedTx.length > 0">
        <v-flex xs12>
          <v-card>
            <v-card-title primary-title>
              <div class="monospaced">
                <div class="clearfix homeLine">
                  <div
                    v-for="(item, num) in aggregatedTx"
                    :key="num"
                  >
                    <div class="clearfix">
                      transactionHash: <br> {{ item.transactionInfo.hash }}
                    </div>
                    <div>deadline:<br>{{ item.deadline.value }}</div>
                    <div>networkType:<br>{{ item.networkType }}</div>
                    <div>signature:<br>{{ item.signature }}</div>
                    <div>signer:<br>{{ item.signer.publicKey }}</div>
                    <div
                      v-for="(i,index) in item.innerTransactions"
                      :key="index"
                    >
                      inner Transactions {{ index + 1 }} :<br>
                      <div>inner Transactions Id:<br>{{ i.transactionInfo.id }}</div>
                      <div>
                        inner Transactions aggregateHash:
                        <br>
                        {{ i.transactionInfo.aggregateHash }}
                      </div>
                    </div>
                    <v-btn @click="cosignTransaction(num)">
                      cosign this transaction
                    </v-btn>
                  </div>
                </div>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
      </div>

      <div v-else>
        <v-card>
          <v-card-title primary-title>
            <div class="monospaced">
              <div class="clearfix homeLine">
                no transactions waiting to be cosigned
              </div>
            </div>
          </v-card-title>
        </v-card>
      </div>
    </v-container>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex';
import {
  PublicAccount,
  AccountHttp,
  NetworkType,
  CosignatureTransaction,
  TransactionHttp,
} from 'nem2-sdk';

export default {
  name: 'MultisigTransactions',
  data() {
    return {
      currentMultisigPublicKey: '',
      activeWallet: this.$store.getters['wallet/GET_ACTIVE_WALLET'],
      aggregatedTx: [],
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
      'multisig',
    ], {
      wallet: state => state.wallet,
      assets: state => state.assets,
      namespaces: state => state.namespaces,
    }),
  },
  watch: {
    async currentMultisigPublicKey() {
      const { activeWallet } = this;
      const accountHttp = new AccountHttp(activeWallet.node);
      const publicAccount = PublicAccount
        .createFromPublicKey(this.currentMultisigPublicKey, NetworkType.MIJIN_TEST);
      this.aggregatedTx = await accountHttp.aggregateBondedTransactions(publicAccount).toPromise();
      // eslint-disable-next-line no-console
      console.log(this.aggregatedTx);
    },
  },
  methods: {
    cosignTransaction(index) {
      // eslint-disable-next-line no-console
      console.log(this.aggregatedTx[index]);
      const activeWallet = this.$store.getters['wallet/GET_ACTIVE_WALLET'];
      const { account } = activeWallet;
      const transactionHttp = new TransactionHttp(activeWallet.node);

      const cosignAggregateBondedTransaction = (transaction) => {
        const cosignatureTransaction = CosignatureTransaction.create(transaction);
        return account.signCosignatureTransaction(cosignatureTransaction);
      };
      const cosignatureSignedTransaction = cosignAggregateBondedTransaction(
        this.aggregatedTx[index],
      );
      transactionHttp.announceAggregateBondedCosignature(cosignatureSignedTransaction);
    },
  },
};
</script>
