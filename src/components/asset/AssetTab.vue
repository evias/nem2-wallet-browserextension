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
  <div>
    <div v-if="assets.length === 0">
      <v-flex xs12>
        <v-alert
          :value="true"
          type="info"
        >
          There is nothing to show here!
        </v-alert>
      </v-flex>
    </div>
    <div v-if="assets.length > 0">
      <v-list
        three-line
      >
        <template v-for="(currentAsset, i) in assets">
          <v-layout
            :key="currentAsset.id"
            column
          >
            <v-list-group
              :key="i"
              :prepend-icon="currentAsset.action"
              no-action
            >
              <template v-slot:activator>
                <v-list-tile
                  ripple
                  color="currentAsset.active?green:blue"
                >
                  <v-list-tile-content class="my-2">
                    <div class="asset-list-header asset-list-header-container">
                      <div class="asset-list-header asset-list-header-left">
                        <v-list-tile-title>
                          {{ currentAsset.name
                            ? `${currentAsset.name} (${currentAsset.id})` : currentAsset.id }}
                        </v-list-tile-title>
                        <v-list-tile-sub-title
                          class="text--primary"
                        >
                          Balance:&nbsp;
                          {{ parseInt(currentAsset.balance).toLocaleString() }}&nbsp;
                          [{{ (currentAsset.amount/Math.pow(10, currentAsset.divisibility))
                            .toLocaleString() }}]
                        </v-list-tile-sub-title>
                        <v-list-tile-sub-title>
                          {{ expirationText(currentAsset) }}
                        </v-list-tile-sub-title>
                      </div>
                      <div class="asset-list-header asset-list-header-right">
                        <div v-if="ownedAssets">
                          <v-btn
                            small
                            color="primary"
                            :disabled="!currentAsset.active || wallet.activeWallet.walletType
                              === walletTypes.WATCH_ONLY_WALLET"
                            @click.stop="wallet.activeWallet.isWatchOnly
                              ? showPasswordInput = true
                              : spawnAliasTransaction(currentAsset)"
                          >
                            {{ currentAsset.name ? `${'unlink alias'}` : `${'add an alias'}` }}
                          </v-btn>
                          <v-btn
                            small
                            color="primary"
                            :disabled="
                              !(currentAsset.active && currentAsset.supplyMutable)
                                || wallet.activeWallet.walletType === walletTypes.WATCH_ONLY_WALLET"
                            @click.stop="wallet.activeWallet.isWatchOnly
                              ? showPasswordInput = true
                              : spawnAssetModification(currentAsset)"
                          >
                            Modify supply
                          </v-btn>
                        </div>
                      </div>
                    </div>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
              <v-list-tile-content>
                <div class="asset-detail">
                  <v-list-tile-title>Meta ID: {{ currentAsset.metaId }}</v-list-tile-title>
                  <v-list-tile-sub-title>Owner: {{ currentAsset.owner }}</v-list-tile-sub-title>
                  <v-list-tile-sub-title>
                    supply: {{ currentAsset.supply.toLocaleString() }} |&nbsp;
                    divisibility: {{ currentAsset.divisibility }} |&nbsp;
                    supplyMutable: {{ currentAsset.supplyMutable }} |&nbsp;
                    transferable: {{ currentAsset.transferable }}
                  </v-list-tile-sub-title>
                </div>
              </v-list-tile-content>
            </v-list-group>
          </v-layout>
          <v-divider
            v-if="i + 1 < assets.length"
            :key="i"
          />
        </template>
      </v-list>
    </div>
    <PasswordInput
      :visible="showPasswordInput"
      :wallet-name="wallet.activeWallet.name"
      :wallet-type="wallet.activeWallet.walletType"
      @close="showPasswordInput = false"
    />
    <AssetModification
      :visible="modifyAsset"
      :active-asset="activeAsset"
      @close="modifyAsset = false"
    />
    <AssetAlias
      :visible="assetAlias"
      :active-asset="activeAsset"
      @close="assetAlias = false"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { walletTypes } from '../../infrastructure/wallet/wallet-types';

import AssetModification from './AssetModification.vue';
import AssetAlias from './AssetAlias.vue';
import PasswordInput from '../wallet/PasswordInput.vue';

export default {
  name: 'AssetTab',
  components: {
    AssetModification,
    AssetAlias,
    PasswordInput,
  },
  props: {
    assets: {
      type: Array,
      default() { return []; },
    },
    ownedAssets: {
      type: Boolean,
      default() { return false; },
    },
  },
  data() {
    return {
      walletTypes,
      index: 0,
      showPasswordInput: false,
      modifyAsset: false,
      assetAlias: false,
      activeAsset: { id: false, name: false },
    };
  },
  computed: mapState(['wallet', 'application']),
  methods: {
    spawnAliasTransaction(mosaic) {
      this.activeAsset = { id: mosaic.id, name: mosaic.name };
      this.modifyAsset = true;
    },

    spawnAssetModification(mosaic) {
      this.activeAsset = { id: mosaic.id, name: mosaic.name };
      this.assetAlias = true;
    },

    expirationText(mosaic) {
      const { blockNumber } = this.application;
      const { endHeight } = mosaic;
      if (endHeight === 0) return 'Unlimited duration mosaic';
      if (!(blockNumber > 0)) return `Expires at height ${endHeight.toLocaleString()}`;
      const expiresIn = endHeight - blockNumber;
      if (expiresIn > 0) return `Expires in ${expiresIn.toLocaleString()} blocks.`;
      return `Expired for ${(expiresIn * -1).toLocaleString()} blocks.`;
    },
  },
};
</script>
