<template>

  <div>
    <v-layout row>
      <v-flex xs3>
        <v-subheader>Multisig Account Publickey</v-subheader>
      </v-flex>
      <v-flex xs9>
        <v-select
                v-model="currentMultisigPublicKey"
                :items="multisigAccountInfo.multisigAccounts"
                item-text="publicKey"
                solo
        />
      </v-flex>
    </v-layout>
    <div v-if="aggregatedTx.length > 0" >
      <v-flex xs12>
        <v-card>
          <v-card-title primary-title>
            <div class="monospaced">
              <div class="clearfix homeLine">
                <div v-for="(item,num) in aggregatedTx">
                  <div  class="clearfix">transactionHash: <br> {{item.transactionInfo.hash}}</div>
                  <div>deadline:<br>{{item.deadline.value}}</div>
                  <div>networkType:<br>{{item.networkType}}</div>
                  <div>signature:<br>{{item.signature}}</div>
                  <div>signer:<br>{{item.signer.publicKey}}</div>
                  <div v-for="(i,index) in item.innerTransactions">
                    inner Transactions {{index+1}} :<br>
                    <div>inner Transactions Id:<br>{{i.transactionInfo.id}}</div>
                    <div>inner Transactions aggregateHash:
                      <br />
                      {{i.transactionInfo.aggregateHash}}
                    </div>
                  </div>
                  <v-btn @click="cosignTransaction(num)">cosign this transaction</v-btn>
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
      no transactions waiting to be cosign
            </div>
          </div>
        </v-card-title>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import {
  PublicAccount,
  AccountHttp,
  NetworkType,
  CosignatureTransaction,
  TransactionHttp} from 'nem2-sdk';
export default {
  name: "MultisigTransactions",
  props:['multisigAccountInfo'],
  computed:{
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
  data:function(){
    return {
      currentMultisigPublicKey:'',
      activeWallet:this.$store.getters['wallet/GET_ACTIVE_WALLET'],
      aggregatedTx:[]
    }
  },
  watch: {
    currentMultisigPublicKey: async function () {
      const activeWallet = this.activeWallet
      const accountHttp = new AccountHttp(activeWallet.node)
      const publicAccount = PublicAccount.createFromPublicKey(this.currentMultisigPublicKey,NetworkType.MIJIN_TEST)
      this.aggregatedTx = await accountHttp.aggregateBondedTransactions(publicAccount).toPromise()
      console.log(this.aggregatedTx)


    }
  },
  methods:{
    cosignTransaction: function (index) {
      console.log(this.aggregatedTx[index])
      const activeWallet = this.$store.getters['wallet/GET_ACTIVE_WALLET'];
      const account = activeWallet.account
      const transactionHttp = new TransactionHttp(activeWallet.node);

      const cosignAggregateBondedTransaction = function (transaction, account){
        const cosignatureTransaction = CosignatureTransaction.create(transaction);
        return account.signCosignatureTransaction(cosignatureTransaction);
      };
      const cosignatureSignedTransaction = cosignAggregateBondedTransaction(this.aggregatedTx[index],account)
      transactionHttp.announceAggregateBondedCosignature(cosignatureSignedTransaction)
    }
  }
}
</script>

<style scoped>

</style>
