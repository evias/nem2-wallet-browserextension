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
// along with nem2-wallet-browserextension.  If not, see <http://www.gnu.org/licenses/>.

<template>
  <div>
    <v-layout
      style="overflow:hidden"
      pa3
    >
      <v-flex
        sm
      >
        <v-layout
          v-if="filterType != 0x04"
          row
        >
          <v-flex>
            <v-btn
              dark
              :color="isAdd?'primary':'red'"
              @click="isAdd=!isAdd"
            >
              {{ isAdd?'Add':'Remove' }}
              <v-icon
                dark
                right
              >
                {{ isAdd?'add_circle_outline':'remove_circle_outline' }}
              </v-icon>
            </v-btn>
          </v-flex>

          <v-flex xs10>
            <v-text-field
              v-model="hexId"
              :placeholder="filterType == 0x01?'input address hex':'input mosaic id'"
              solo
            />
          </v-flex>

          <v-flex xs1>
            <v-btn
              :disabled="hexId === ''"
              color="primary"
              @click="addFilter"
            >
              <v-icon>add</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>

        <v-layout
          v-else
          row
        >
          <v-flex>
            <v-btn
              dark
              :color="isAdd?'primary':'red'"
              @click="isAdd=!isAdd"
            >
              {{ isAdd?'Add':'Remove' }}
              <v-icon
                dark
                right
              >
                {{ isAdd?'add_circle_outline':'remove_circle_outline' }}
              </v-icon>
            </v-btn>
          </v-flex>

          <v-flex xs5>
            <v-select
              v-model="additionalModification.hexEntityType"
              :items="entityTypes"
              item-text="label"
              item-value="hexEntityType"
              label="(Option) Select From"
              solo
            />
          </v-flex>

          <v-flex xs5>
            <v-text-field
              v-model="additionalModification.hexEntityType"
              class="ma-0 pa-0"
              solo
              required
            />
          </v-flex>

          <v-flex xs1>
            <v-btn
              :disabled="hexId === '' && additionalModification.hexEntityType === ''"
              color="primary"
              @click="addFilter"
            >
              <v-icon>add</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
        <template v-for="(filter, index) in filterList">
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
                  {{ filter.propertyModificationType == 0 ? 'add':'remove' }}
                </v-subheader>
                {{ filterType == 0x04 ? 'Entity Type:':'' }}
                {{ filterType == 0x02 ? 'Mosaic Id:':'' }}
                {{ filterType == 0x01 ? 'Address Hex:':'' }}
                {{ filter.hexId }}
              </v-list-tile-content>
              <v-btn
                fab
                small
                color="error"
                @click="removeFilter(index)"
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
        justify-end
        align-center
      >
        <v-btn
          flat
          @click="$emit('closeFilter')"
        >
          Close
        </v-btn>
        <v-btn
          :disabled="disabledSendTransaction"
          color="primary mx-0"
          @click="showDialog"
        >
          Send Transaction
        </v-btn>
      </v-layout>

      <Confirmation
        v-model="isDialogShow"
        :transactions="transactions"
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
            v-for="(detail,index) in filterList"
            :key="index"
          >
            <v-list-tile-action>
              <v-icon />
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ detail.propertyModificationType == 0 ? 'add':'remove' }}:{{ detail.hexId }}
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
  </div>
</template>

<script>
import {
  PropertyModificationType,
  NetworkType,
  ModifyAccountPropertyAddressTransaction,
  ModifyAccountPropertyMosaicTransaction,
  ModifyAccountPropertyEntityTypeTransaction,
  Deadline,
  UInt64,
  AccountPropertyTransaction,
  Address,
  TransactionType,
  MosaicId,
} from 'nem2-sdk';
import Confirmation from '../Confirmation.vue';
import SendConfirmation from './SendConfirmation.vue';

export default {
  name: 'FilterTransaction',
  components: {
    Confirmation,
    SendConfirmation,
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['actionType', 'filterType', 'maxFee'],
  data() {
    return {
      filterList: [],
      isAdd: true,
      hexId: '',
      disabledSendTransaction: false,
      isDialogShow: false,
      dialogDetails: [],
      transactions: [],
      txSendResults: [],
      entityType: {},
      entityTypes: [
        { label: 'Transfer', entityType: TransactionType.TRANSFER },
        { label: 'Namespace', entityType: TransactionType.REGISTER_NAMESPACE },
        { label: 'Mosaic Supply Change', entityType: TransactionType.MOSAIC_SUPPLY_CHANGE },
        { label: 'Modify multisig', entityType: TransactionType.MODIFY_MULTISIG_ACCOUNT },
        { label: 'Aggregate Complete', entityType: TransactionType.AGGREGATE_COMPLETE },
        { label: 'Aggregate Bonded', entityType: TransactionType.AGGREGATE_BONDED },
        { label: 'Lock Funds', entityType: TransactionType.LOCK },
        { label: 'Secret Lock', entityType: TransactionType.SECRET_LOCK },
        { label: 'Secret Proof', entityType: TransactionType.SECRET_PROOF },
        { label: 'Address Alias', entityType: TransactionType.ADDRESS_ALIAS },
        { label: 'Mosaic Alias', entityType: TransactionType.MOSAIC_ALIAS },
        { label: 'Account Property Address', entityType: TransactionType.MODIFY_ACCOUNT_PROPERTY_ADDRESS },
        { label: 'Account Property Mosaic', entityType: TransactionType.MODIFY_ACCOUNT_PROPERTY_MOSAIC },
        { label: 'Account Property Entity Type', entityType: TransactionType.MODIFY_ACCOUNT_PROPERTY_ENTITY_TYPE },
      // eslint-disable-next-line max-len
      ].map(x => ({ label: x.label, entityType: x.entityType, hexEntityType: x.entityType.toString(16).toUpperCase() })),
      additionalModification: {
        isAdd: true,
        hexEntityType: '4152',
      },
      currentEntityTypeId: 1,
    };
  },
  watch: {
    filterType() {
      this.filterList = [];
      this.hexId = '';
    },
  },
  methods: {
    addFilter() {
      let filter;
      if (this.filterType !== 0x04) {
        filter = {
          hexId: this.hexId,
          propertyModificationType: this.isAdd
            ? PropertyModificationType.Add : PropertyModificationType.Remove,
        };
      } else {
        filter = {
          hexId: this.additionalModification.hexEntityType,
          propertyModificationType: this.isAdd
            ? PropertyModificationType.Add : PropertyModificationType.Remove,
        };
      }
      this.filterList.push(filter);
    },
    removeFilter(index) {
      this.filterList.splice(index, 1);
    },
    showDialog() {
      if (this.filterType === 0x01) {
        this.generateAddressTransaction();
      } else if (this.filterType === 0x02) {
        this.generateMosaicTransaction();
      } else if (this.filterType === 0x04) {
        this.generateEntityTypeTransaction();
      }

      this.dialogDetails = [
        {
          icon: 'add',
          key: 'FilterType',
          value: 'Address',
        },
        {
          icon: 'add',
          key: 'ActionType',
          value: this.actionType === 0 ? 'allow' : 'block',
        },
        {
          icon: 'add',
          key: 'MaxFee',
          value: this.maxFee,
        },
        {
          icon: 'add',
          key: 'List',
          value: '',
        },
      ];
      this.isDialogShow = true;
    },
    generateAddressTransaction() {
      const {
        maxFee, actionType, filterType, filterList,
      } = this;
      const propertyType = actionType + filterType;

      const modifyAccountPropertyAddressTransaction = new ModifyAccountPropertyAddressTransaction(
        NetworkType.MIJIN_TEST,
        1,
        Deadline.create(),
        UInt64.fromUint(maxFee),
        propertyType,
        filterList.map(modification => AccountPropertyTransaction.createAddressFilter(
          modification.propertyModificationType,
          Address.createFromRawAddress(modification.hexId),
        )),
      );
      this.transactions = [modifyAccountPropertyAddressTransaction];
    },
    generateMosaicTransaction() {
      const {
        maxFee, actionType, filterType, filterList,
      } = this;
      const propertyType = actionType + filterType;

      const modifyAccountPropertyMosaicTransaction = new ModifyAccountPropertyMosaicTransaction(
        NetworkType.MIJIN_TEST,
        1,
        Deadline.create(),
        UInt64.fromUint(maxFee),
        propertyType,
        filterList.map(modification => AccountPropertyTransaction.createMosaicFilter(
          modification.propertyModificationType,
          new MosaicId(modification.hexId),
        )),
      );
      this.transactions = [modifyAccountPropertyMosaicTransaction];
    },
    generateEntityTypeTransaction() {
      const {
        maxFee, actionType, filterType, filterList,
      } = this;
      const propertyType = actionType + filterType;

      // eslint-disable-next-line max-len
      const modifyAccountPropertyEntityTypeTransaction = new ModifyAccountPropertyEntityTypeTransaction(
        NetworkType.MIJIN_TEST,
        1,
        Deadline.create(),
        UInt64.fromUint(maxFee),
        propertyType,
        filterList.map(modification => AccountPropertyTransaction.createEntityTypeFilter(
          modification.propertyModificationType,
          Number('0x'.concat(modification.hexId)),
        )),
      );

      this.transactions = [modifyAccountPropertyEntityTypeTransaction];
    },
    txSent(result) {
      this.txSendResults.push({
        txHash: result.txHash,
        nodeURL: result.nodeURL,
      });
    },
    txError(error) {
      // eslint-disable-next-line no-console
      console.error(error);
    },
  },
};
</script>

