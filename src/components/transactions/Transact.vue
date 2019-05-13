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
  <v-layout
    row
    pb-2
    mt-4
  >
    <v-container
      fluid
      pa-0
      ma-0
    >
      <v-layout
        row
        wrap
      >
        <v-flex
          xs12
        >
          <Errors class="mb-4" />

          <v-tabs
            v-model="tab"
            grow
          >
            <v-tabs-slider color="yellow" />


            <v-tab key="1">
              Transfer
            </v-tab>
            <v-tab-item key="1">
              <Transfer />
            </v-tab-item>


            <v-tab key="2">
              URI
            </v-tab>
            <v-tab-item key="2">
              <Transfer />
            </v-tab-item>


            <v-tab key="3">
              filters
            </v-tab>
            <v-tab-item key="3">
              <Transfer />
            </v-tab-item>
          </v-tabs>
        </v-flex>
      </v-layout>
    </v-container>
  </v-layout>
</template>

<script>
import Errors from '../Errors.vue';
import Transfer from './tabs/Transfer.vue';

export default {
  components: {
    Errors,
    Transfer,
  },
};

</script>
