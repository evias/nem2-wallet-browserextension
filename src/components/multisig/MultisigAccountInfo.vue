<template>
    <v-flex xs12 v-if="typeof multisigAccountInfo.account == 'undefined'">
        <v-card>
            <v-card-title primary-title>
                <div class="monospaced">
                    <div class="clearfix homeLine">
                      this account is not a multisig or a cosignatory
                    </div>
                </div>
            </v-card-title>
        </v-card>
    </v-flex>

    <v-flex xs12 v-else>
        <v-card>
            <v-card-title primary-title>
                <div class="monospaced">
                    <div class="clearfix homeLine">
                        <div class="clearfix">
                            account public key:
                        </div>
                        <div class="clearfix">
                            {{ typeof multisigAccountInfo.account == 'undefined'?'':multisigAccountInfo.account.publicKey}}
                        </div>
                    </div>

                    <div class="clearfix homeLine">
                        <div class="clearfix">
                            min approval:
                        </div>
                        <div class="clearfix">
                            {{ multisigAccountInfo.minApproval}}
                        </div>
                    </div>

                    <div class="clearfix homeLine">
                        <div class="clearfix">
                            min removal:
                        </div>
                        <div class="clearfix">
                            {{ multisigAccountInfo.minRemoval}}
                        </div>
                    </div>

                    <div class="clearfix homeLine">
                        <div class="clearfix">
                            cosignatory list:
                        </div>
                        <div class="clearfix" v-for="m in multisigAccountInfo.cosignatories">
                            {{ m.publicKey}}
                        </div>
                    </div>
                    <div class="clearfix homeLine">
                        <div class="clearfix">
                            multisig account list:
                        </div>
                        <div v-if="multisigAccountInfo.multisigAccounts.length == 0">
                            this account does not own any multisig account
                        </div>
                        <div v-else class="clearfix" v-for="m in multisigAccountInfo.multisigAccounts">
                            {{ m.publicKey}}
                        </div>
                    </div>
                </div>
            </v-card-title>
        </v-card>
    </v-flex>
</template>

<script>
    export default {
        name: "MultisigInfo",
        props:{
            multisigAccountInfo: {
                type: Object,
                default() {
                    return {
                        account :{
                        }
                    };
                },
            },}
    }
</script>

<style scoped>

</style>
