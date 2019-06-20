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
        <template v-for="(a, i) in assets">
          <v-layout
            :key="a.id"
            column
          >
            <v-list-group
              :key="i"
              :prepend-icon="a.action"
              no-action
            >
              <template v-slot:activator>
                <v-list-tile
                  ripple
                  color="a.active?green:blue"
                >
                  <v-list-tile-content class="my-2">
                    <div class="asset-list-header asset-list-header-container">
                      <div class="asset-list-header asset-list-header-left">
                        <v-list-tile-title>{{ a.title }}</v-list-tile-title>
                        <v-list-tile-sub-title
                          class="text--primary"
                        >
                          Balance:&nbsp;
                          {{ parseInt(a.balance).toLocaleString() }}&nbsp;
                          [{{ (a.amount/Math.pow(10, a.divisibility)).toLocaleString() }}]
                        </v-list-tile-sub-title>
                        <v-list-tile-sub-title>{{ a.expirationText }}</v-list-tile-sub-title>
                      </div>
                      <div class="asset-list-header asset-list-header-right">
                        <div v-if="ownedAssets">
                          <v-btn
                            small
                            color="primary"
                            :disabled="wallet.activeWallet.isWatchOnly"
                            @click.stop="
                              activeAsset = a.id;
                              assetAlias = true"
                          >
                            Add an alias
                          </v-btn>
                          <v-btn
                            small
                            color="primary"
                            :disabled="
                              !(a.active && a.supplyMutable)
                                || wallet.activeWallet.isWatchOnly"
                            @click.stop="
                              activeAsset = a.id;
                              modifyAsset = true;"
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
                  <v-list-tile-title>Meta ID: {{ a.metaId }}</v-list-tile-title>
                  <v-list-tile-sub-title>Owner: {{ a.owner }}</v-list-tile-sub-title>
                  <v-list-tile-sub-title>
                    supply: {{ a.supply.toLocaleString() }} |&nbsp;
                    divisibility: {{ a.divisibility }} |&nbsp;
                    supplyMutable: {{ a.supplyMutable }} | transferable: {{ a.transferable }}
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
import AssetModification from './AssetModification.vue';
import AssetAlias from './AssetAlias.vue';

export default {
  name: 'AssetTab',
  components: {
    AssetModification,
    AssetAlias,
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    assets: {
      type: Array,
    },
    ownedAssets: {
      type: Boolean,
      default() { return false; },
    },
    activeAsset: {
      type: String,
      default() { return ''; },
    },
  },
  data() {
    return {
      index: 0,
      modifyAsset: false,
      assetAlias: false,
    };
  },
  computed: mapState(['wallet']),
};
</script>
