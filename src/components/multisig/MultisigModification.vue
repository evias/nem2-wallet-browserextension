<template>
    <v-scale-transition>

        <v-layout
                column
                class="mb-3"
        >

            <v-layout row>
                <v-flex xs12>
                    <v-subheader
                            class="mb-3"
                    >
                        <h3>Modify Multisig</h3>
                    </v-subheader>
                </v-flex>
            </v-layout>

            <v-layout row>
                <v-flex xs3>
                    <v-subheader>Multisig Account Publickey</v-subheader>
                </v-flex>
                <v-flex xs7>
                    <v-select
                            v-model="currentMultisigPublicKey"
                            :items="multisigAccountInfo.multisigAccounts"
                            item-text="publicKey"
                            solo
                    />
                </v-flex>
            </v-layout>

            <v-layout>
                <v-flex xs3>
                    <v-subheader>Approval Delta</v-subheader>
                </v-flex>
                <v-flex xs7>
                    <v-text-field
                            v-model="approvalDelta"
                            class="ma-0 pa-0"
                            label="Integer in the range of 0 and 10"
                            type="number"
                            solo
                            required
                            number
                    />
                </v-flex>
            </v-layout>

            <v-layout>
                <v-flex xs3>
                    <v-subheader>Removal Delta</v-subheader>
                </v-flex>
                <v-flex xs7>
                    <v-text-field
                            v-model="removalDelta"
                            class="ma-0 pa-0"
                            label="Integer in the range of 0 and 10"
                            type="number"
                            solo
                            required
                            number
                    />
                </v-flex>
            </v-layout>

            <v-layout>
                <v-flex xs3>
                    <v-subheader>Max Fee</v-subheader>
                </v-flex>
                <v-flex xs7>
                    <v-text-field
                            v-model="maxFee"
                            class="ma-0 pa-0"
                            label="max fee"
                            type="number"
                            solo
                            required
                            number
                    />
                </v-flex>
            </v-layout>

            <v-layout v-if="showLockFunds" row>
                <v-flex xs3>
                    <v-subheader>Lock Funds Mosaic</v-subheader>
                </v-flex>
                <v-flex xs4>
                    <v-text-field
                            v-model="lockFundsMosaicType"
                            class="ma-0 pa-0"
                            solo
                            required
                            disabled
                    />

                </v-flex>
                <v-flex xs3>
                    <v-text-field
                            v-model="lockFundsMosaicAmount"
                            class="ma-0 pa-0"
                            type="number"
                            solo
                            required
                            number
                    />
                </v-flex>
            </v-layout>


            <v-layout v-if="showLockFunds">
                <v-flex xs3>
                    <v-subheader>Lock Funds Duration In Blocks</v-subheader>
                </v-flex>
                <v-flex xs7>
                    <v-text-field
                            v-model="lockFundsDuration"
                            class="ma-0 pa-0"
                            type="number"
                            solo
                            required
                            number
                    />
                </v-flex>
            </v-layout>

            <v-layout v-if="showLockFunds">
                <v-flex xs3>
                    <v-subheader>Lock Funds Max Fee</v-subheader>
                </v-flex>
                <v-flex xs7>
                    <v-text-field
                            v-model="lockFundsMaxFee"
                            class="ma-0 pa-0"
                            type="number"
                            solo
                            required
                            number
                    />
                </v-flex>
            </v-layout>


            <v-layout>
                <v-flex sm>
                    <v-layout row>
                        <v-flex  offset-xs1>
                            <v-btn color="primary"
                                   dark
                                   :color="isAdd?'primary':'red'" @click="isAdd = !isAdd"
                            >
                                {{isAdd?'Add':'Remove'}}
                                <v-icon dark right>{{isAdd ?'add_circle_outline':'remove_circle_outline'}}</v-icon>
                            </v-btn>
                        </v-flex>

                        <v-flex xs6  >
                            <v-text-field
                                    v-model="currentCosignatoryPublicKey"
                                    placeholder="input cosignatory publickey"
                                    solo
                            />
                        </v-flex>

                        <v-flex xs3>
                            <v-btn
                                    :disabled="currentCosignatoryPublicKey === ''"
                                    color="primary"
                                    @click="addCosignatory"
                            >
                                <v-icon>add</v-icon>
                            </v-btn>
                        </v-flex>
                    </v-layout>

                    <template v-for="(cosignatory, index) in cosignatoryList">
                        <v-list
                                :key="index"
                                two-line
                        >
                            <v-list-tile>
                                <v-list-tile-action>
                                    <v-icon>style</v-icon>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    <v-subheader>
                                        {{cosignatory.modificationType == 0 ? 'add':'remove'}}
                                    </v-subheader>
                                    cosignatory publickey:
                                    {{ cosignatory.cosignatoryPublicKey}}
                                </v-list-tile-content>
                                <v-btn
                                        fab
                                        small
                                        color="error"
                                        @click="removeCosignatory(index)"
                                >
                                    <v-icon>remove</v-icon>
                                </v-btn>
                            </v-list-tile>
                        </v-list>
                    </template>
                </v-flex>
            </v-layout>

            <v-layout>
                <v-layout
                        row
                        justify-center
                        align-center
                >
                    <v-btn
                            :disabled="disabledSendLockFundsTransaction"
                            @click="showDialog"
                    >
                        {{showLockFunds?'Send Transaction':'Send LockFunds Transaction'}}
                    </v-btn>
                    <v-btn
                            :disabled="disabledSendAggregateTransaction"
                            v-if="showLockFunds"
                            color="primary mx-0"
                            @click="sendAggregate"
                    >
                        Send Aggregate Transaction
                    </v-btn>

                </v-layout>

                <Confirmation
                        v-model="isDialogShow"
                        :transactions="txs"
                        @sent="txSent"
                        @error="txError"
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

                        <v-list-tile
                                v-for="(cosignatory,index) in cosignatoryList"
                                :key="index"
                        >
                            <v-list-tile-action>
                                <v-icon></v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>
                                    {{cosignatory.modificationType == 0 ? 'add': 'remove'}}:
                                    {{cosignatory.cosignatoryPublicKey}}
                                </v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>

                    </v-list>
                </Confirmation>
            </v-layout>

            <v-layout column>
                <SendConfirmation
                        :tx-send-data="txSendResults"
                />
            </v-layout>


        </v-layout>
    </v-scale-transition>
</template>

<script>
    import { mapState } from 'vuex';
    import Confirmation from '../Confirmation'
    import SendConfirmation from './SendConfirmation'
    import {
        ModifyMultisigAccountTransaction,
        MultisigCosignatoryModificationType,
        NetworkType,
        Deadline,
        PublicAccount,
        AggregateTransaction,
        TransactionType,
        MultisigCosignatoryModification,
        UInt64,
        LockFundsTransaction,
        Mosaic,
        MosaicId,
        AccountHttp,
        Address,
        NamespaceId,
        Listener,
        Account,
        TransactionHttp,
        NetworkCurrencyMosaic,
        NamespaceHttp
    } from 'nem2-sdk'
    export default {
        name: "ModifyMultisig",
        components:{
            Confirmation,
            SendConfirmation
        },
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
        watch: {
            currentMultisigPublicKey: async function () {
                const activeWallet = this.activeWallet
                const accountHttp = new AccountHttp(activeWallet.node)
                this.currentMultisigAccount = await accountHttp.getMultisigAccountInfo(Address.createFromPublicKey(this.currentMultisigPublicKey,NetworkType.MIJIN_TEST)).toPromise()
                if(this.currentMultisigAccount.minApproval > 1){
                    this.showLockFunds = true
                }else {
                    this.showLockFunds = false
                }
            }
        },
        data:function(){
            return {
                showLockFunds: true,
                currentMultisigPublicKey:'',
                currentMultisigAccount: '',
                removalDelta: 0,
                approvalDelta: 0,
                isAdd: true,
                currentCosignatoryPublicKey: '',
                cosignatoryList:[],
                maxFee: 0,
                lockFundsMosaicType:'@cuurency.cat',
                lockFundsMosaicAmount: 10000000,
                lockFundsDuration: 480,
                lockFundsMaxFee: 0,
                isDialogShow: false,
                txs: [],
                dialogDetails: [],
                disabledSendLockFundsTransaction: false,
                disabledSendAggregateTransaction:true,
                txSendResults:[],
                activeWallet: this.$store.getters['wallet/GET_ACTIVE_WALLET'],
                aggregateTx:{}
            }
        },
        methods:{
            addCosignatory:function () {
                let {isAdd,currentCosignatoryPublicKey} = this
                this.cosignatoryList.push({
                    cosignatoryPublicKey: currentCosignatoryPublicKey,
                    modificationType: isAdd
                })
                this.currentCosignatoryPublicKey = ''
            },
            removeCosignatory:function(index){
                this.cosignatoryList.splice(index,1)
            },
            showDialog(){

                if(this.currentMultisigAccount.minApproval > 1){
                    console.log(this.currentMultisigAccount)
                    this.createBonded()
                }else {
                    this.createComplete()
                }

                /*优化*/
                this.dialogDetails = [
                    {
                        icon: 'add',
                        key: 'NamespaceType',
                        value: this.namespaceType === 0 ? 'RootNamespace' : 'SubNamespace',
                    },
                    {
                        icon: 'add',
                        key: 'Namespace name',
                        value: this.namespaceType === 0 ? this.namespaceName : (`${this.parentNamespaceName}.${this.namespaceName}`),
                    },
                    {
                        icon: 'add',
                        key: 'Duration',
                        value: this.duration,
                    },
                ];
                // this.isDialogShow = true;
            },
            async createBonded() {
                const multisigPublicAccount = PublicAccount.createFromPublicKey(this.currentMultisigPublicKey,NetworkType.MIJIN_TEST)

                const activeWallet = this.$store.getters['wallet/GET_ACTIVE_WALLET'];
                const account = activeWallet.account
                const network = NetworkType.MIJIN_TEST
                const transactionHttp = new TransactionHttp(activeWallet.node)

                const minApprovalDelta = this.approvalDelta
                const minRemovalDelta = this.removalDelta
                const cosignatories = this.cosignatoryList
                const endpoint = activeWallet.node


                // const mosaicId = this.lockFundsMosaicType
                const  namespaceHttp = new NamespaceHttp(activeWallet.node)
                const namespaceId = NetworkCurrencyMosaic.NAMESPACE_ID;
                const mosaicId = await namespaceHttp.getLinkedMosaicId(namespaceId).toPromise();
                console.log(mosaicId,"////")

                const modifyMultisigAccountTx = ModifyMultisigAccountTransaction.create(
                        Deadline.create(),
                        minApprovalDelta,
                        minRemovalDelta,
                        cosignatories.map((co) => {
                            return new MultisigCosignatoryModification(
                                    co.modificationType ? MultisigCosignatoryModificationType.Add : MultisigCosignatoryModificationType.Remove,
                                    co.modificationType ? MultisigCosignatoryModificationType.Add : MultisigCosignatoryModificationType.Remove,
                                    PublicAccount.createFromPublicKey(co.cosignatoryPublicKey, network)
                            )
                        }),
                        network
                )

                const aggregateTx = new AggregateTransaction(
                        network,
                        TransactionType.AGGREGATE_BONDED,
                        2,
                        Deadline.create(23),
                        UInt64.fromUint(this.maxFee),
                        [
                            modifyMultisigAccountTx.toAggregate(multisigPublicAccount)
                        ]
                )

                const signedAggregateTx = account.sign(aggregateTx)
                this.aggregateTx = signedAggregateTx

                const lockFundsMosaicAmount = this.lockFundsMosaicAmount
                let lockMosaic = new Mosaic(
                        mosaicId,
                        UInt64.fromUint(lockFundsMosaicAmount>=10000000?lockFundsMosaicAmount:10000000)
                )

                const lockFundsTx = new LockFundsTransaction(
                        network,
                        1,
                        Deadline.create(23),
                        UInt64.fromUint(this.lockFundsMaxFee),
                        lockMosaic,
                        UInt64.fromUint(this.lockFundsDuration),
                        signedAggregateTx
                )
                const signedLockFundsTx = activeWallet.account.sign(lockFundsTx);
                console.log(activeWallet)
                // this.txs = [lockFundsTx,aggregateTx];

                transactionHttp.announce(signedLockFundsTx)
                console.log(signedLockFundsTx.hash)
                const listener = new Listener(activeWallet.node.replace('http','ws'),WebSocket)

                const that = this
                listener.open().then(()=>{
                    listener.confirmed(activeWallet.account.address).subscribe(function () {
                        that.disabledSendAggregateTransaction = false
                        console.log(that.disabledSendAggregateTransaction)
                        listener.close()
                    })
                })


            },
            sendAggregate(){
                const activeWallet = this.$store.getters['wallet/GET_ACTIVE_WALLET'];
                const transactionHttp = new TransactionHttp(activeWallet.node)

                transactionHttp.announceAggregateBonded(this.aggregateTx)
                console.log(this.aggregateTx)
            },
            createComplete(){
                const multisigPublicAccount = PublicAccount.createFromPublicKey(this.currentMultisigPublicKey,NetworkType.MIJIN_TEST)
                const network = NetworkType.MIJIN_TEST

                const minApprovalDelta = this.approvalDelta
                const minRemovalDelta = this.removalDelta
                const cosignatories = this.cosignatoryList

                const modifyMultisigAccountTx = ModifyMultisigAccountTransaction.create(
                        Deadline.create(),
                        minApprovalDelta,
                        minRemovalDelta,
                        cosignatories.map((co) => {
                            return new MultisigCosignatoryModification(
                                    co.modificationType ? MultisigCosignatoryModificationType.Add : MultisigCosignatoryModificationType.Remove,
                                    PublicAccount.createFromPublicKey(co.cosignatoryPublicKey, network)
                            )
                        }),
                        network
                )
                console.log(cosignatories)
                console.log(modifyMultisigAccountTx)

                const aggregateTx = AggregateTransaction.createComplete(
                        Deadline.create(),
                        [modifyMultisigAccountTx.toAggregate(multisigPublicAccount)],
                        NetworkType.MIJIN_TEST,
                        []);

                this.txs = [aggregateTx];

            },
            txSent(result) {
                this.txSendResults.push({
                    txHash: result.txHash,
                    nodeURL: result.nodeURL,
                });
            },
            txError(error) {
                console.error(error);
            },
        },

    }
</script>

<style scoped>

</style>
