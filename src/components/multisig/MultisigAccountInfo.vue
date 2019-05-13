<template>
  <v-flex
    v-if="typeof multisigAccountInfo.account == 'undefined'"
    xs12
  >
    <v-card>
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
    v-else
    xs12
  >
    <v-card>
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
</template>

<script>
export default {
  name: 'MultisigInfo',
  props: {
    multisigAccountInfo: {
      type: Object,
      default() {
        return {
          account: {
          },
        };
      },
    } 
  },
};
</script>

<style scoped>

</style>
