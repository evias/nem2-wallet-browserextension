<template>
  <v-container fluid>
    <v-layout wrap>
      <v-flex xs12>
        <v-combobox
                v-model="transactionType"
                :items="transactionTypeLists"
                label="choose multisig transaction type"
        ></v-combobox>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex xs12>
        <v-select
                v-model="currentMultisigPublicKey"
                label="Multisig Account Publickey"
                :items="multisig.multisigInfo[wallet.activeWallet.name].multisigAccounts"
                item-text="publicKey"
        />
      </v-flex>
    </v-layout>
    <Transfer :currentMultisigPublicKey="currentMultisigPublicKey"></Transfer>

  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import Transfer from './otherMultisigTransactionComponents/Transfer.vue';

export default {
  name: 'OtherMultisigTransactions',
  components: {
    Transfer,
  },
  data() {
    return {
      transactionTypeLists: ['transfer'],
      transactionType: '',
      currentMultisigPublicKey: '',
    };
  },
  watch: {
    transactionType() {
      console.log('change tx panel');
    },
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
};
</script>

<style scoped>

</style>
