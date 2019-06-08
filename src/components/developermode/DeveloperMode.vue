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
    column
    xs12
  >
    <v-flex xs12>
      <DeveloperModeAccount />
    </v-flex>
    <v-flex xs12>
      <DeveloperModePublicKey />
    </v-flex>
    <v-flex xs12>
      <DeveloperModeConversion />
    </v-flex>
    <v-flex xs12>
      <DeveloperModeTimestamp />
    </v-flex>
    <v-flex xs12>
      <DeveloperModeNamespace />
    </v-flex>
  </v-layout>
</template>
<script>
import DeveloperModeAccount from './DeveloperModeAccount.vue';
import DeveloperModeConversion from './DeveloperModeConversion.vue';
import DeveloperModeNamespace from './DeveloperModeNamespace.vue';
import DeveloperModeTimestamp from './DeveloperModeTimestamp.vue';
import DeveloperModePublicKey from './DeveloperModePublicKey.vue';

export default {
  components: {
    DeveloperModeAccount,
    DeveloperModeConversion,
    DeveloperModeNamespace,
    DeveloperModeTimestamp,
    DeveloperModePublicKey,
  },
};
</script>
<style scoped>
</style>
