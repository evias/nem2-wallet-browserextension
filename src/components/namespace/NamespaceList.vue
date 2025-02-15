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
// along with nem2-wallet-browserextension.  If not, see http://www.gnu.org/licenses/.

<template>
  <v-layout column>
    <v-list
      three-line
      class="py-0"
    >
      <v-slide-y-transition
        group
        tag="v-list"
        class="py-0"
      >
        <template
          v-for="(iterNamespace, index) in namespaces
            .namespaces[wallet.activeWallet.name]"
        >
          <v-layout
            :key="iterNamespace.name"
            column
          >
            <v-list-tile
              avatar
              ripple
            >
              <v-list-tile-content class="my-2">
                <v-list-tile-title>
                  {{ iterNamespace.name }} ({{ iterNamespace.hexId }})
                </v-list-tile-title>
                <v-list-tile-sub-title>
                  <div class="monospaced">
                    {{ expirationText(iterNamespace) }}
                    <a
                      v-if="wallet.activeWallet.walletType !== walletTypes.WATCH_ONLY_WALLET
                        && iterNamespace.namespaceType === NamespaceType.RootNamespace"
                      @click.stop="wallet.activeWallet.isWatchOnly
                        ? showPasswordInput = true
                        : spawnExtendNamespace(iterNamespace)"
                    >
                      extend
                    </a>
                  </div>
                </v-list-tile-sub-title>
                <v-list-tile-sub-title>
                  <div class="monospaced">
                    {{ messages.namespaces['namespace alias type'][iterNamespace.aliasType] }}
                    {{ iterNamespace.aliasText }}
                    <a
                      v-if="wallet.activeWallet.walletType !== walletTypes.WATCH_ONLY_WALLET"
                      @click.stop="wallet.activeWallet.isWatchOnly
                        ? showPasswordInput = true
                        : spawnAliasTransaction(iterNamespace)"
                    >
                      {{ messages.namespaces['namespace alias action'][iterNamespace.aliasType] }}
                    </a>
                  </div>
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-layout>
          <v-divider
            v-if="index + 1 < namespaces.namespaces[wallet.activeWallet.name].length"
            :key="index"
          />
        </template>
      </v-slide-y-transition>
    </v-list>
    <PasswordInput
      :visible="showPasswordInput"
      :wallet-name="wallet.activeWallet.name"
      :wallet-type="wallet.activeWallet.walletType"
      @close="showPasswordInput = false"
    />
    <NamespaceExtension
      :visible="extendNamespace"
      :namespace-name="currentNamespaceName"
      :end-height="currentNamespaceEndHeight"
      @close="extendNamespace = false"
    />
    <AliasTransaction
      :visible="aliasTransaction"
      :namespace-name="currentNamespaceName"
      :current-alias-type="currentAliasType"
      :current-alias="currentAlias"
      @close="aliasTransaction = false"
    />
  </v-layout>
</template>
<script>
import { mapState } from 'vuex';
import { NamespaceType } from 'nem2-sdk';
import { walletTypes } from '../../infrastructure/wallet/wallet-types';
import messages from '../../locales/messages';

import AliasTransaction from './AliasTransaction.vue';
import PasswordInput from '../wallet/PasswordInput.vue';
import NamespaceExtension from './NamespaceExtension.vue';

export default {
  name: 'NamespaceList',
  components: {
    AliasTransaction,
    PasswordInput,
    NamespaceExtension,
  },
  data() {
    return {
      NamespaceType,
      walletTypes,
      messages,
      showPasswordInput: false,
      extendNamespace: false,
      aliasTransaction: false,
      currentAlias: '',
      currentAliasType: 0,
      currentNamespaceEndHeight: 0,
      currentNamespaceName: '',
    };
  },
  computed: mapState([
    'application',
    'namespaces',
    'wallet',
  ]),
  methods: {
    spawnExtendNamespace(namespace) {
      this.currentNamespaceName = namespace.name;
      this.currentNamespaceEndHeight = namespace.endHeight;
      this.extendNamespace = true;
    },
    spawnAliasTransaction(namespace) {
      this.currentNamespaceName = namespace.name;
      this.currentAliasType = namespace.aliasType;
      this.currentAlias = namespace.aliasText;
      this.aliasTransaction = true;
    },
    expirationText(namespace) {
      const { blockNumber } = this.application;
      const { endHeight } = namespace;
      if (!(blockNumber > 0)) return `This namespace expires at height ${endHeight.toLocaleString()}`;
      const expiresIn = endHeight - blockNumber;
      if (expiresIn > 0) return `This namespace expires in ${expiresIn.toLocaleString()} blocks.`;
      return `This namespace has been expired for ${(expiresIn * -1).toLocaleString()} blocks.`;
    },
  },
};

</script>
