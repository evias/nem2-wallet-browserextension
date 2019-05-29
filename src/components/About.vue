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
    <h1 class="headline pt-3">
      About nem2-wallet
    </h1>

    <h2 class="sub-headline pt-3">
      For users
    </h2>
    <p>
      This wallet is under development, if you find any issue <a
        href="https://github.com/decentraliser/nem2-wallet-browserextension/issues"
        target="_new"
      >please report them on Github</a>
    </p>
    <p>
      The wallet <a
        href="https://github.com/decentraliser/nem2-wallet-browserextension/releases"
        target="_new"
      >is available as a Mozilla Firefox extension</a>
    </p>
    <p>
      It is also <a
        href="http://wallet.nemesis.land"
        target="_new"
      >deployed as a web version.</a>
      Please note that URI transaction handling can only be done with the web extension
    </p>
    <v-layout column>
      <v-flex>
        <h2 class="sub-headline pt-3">
          For developers
        </h2>

        <v-layout class="align-center ml-0 mb-1">
          <b>Source code repository:</b>
          <a
            href="https://github.com/decentraliser/nem2-wallet-browserextension"
            class="mx-1"
          >https://github.com/decentraliser/nem2-wallet-browserextension</a> licenced under
          <img
            src="https://img.shields.io/badge/License-GPL%20v3-blue.svg"
            class="ml-1"
          >
        </v-layout>

        <ul class="mt-3 faq">
          <li>How can I contribute?</li>
        </ul>
        <p>
          Please <a
            href="https://github.com/decentraliser/nem2-wallet-browserextension"
            class="mx-1"
          >refer to the readme for guidance</a>, and make sure to join the <a
            href="https://nem2.slack.com/"
            class="mx-1"
          >#sig-client Slack channel</a> to get in touch with the devs!
        </p>
        <ul class="mt-3 faq">
          <li>How can I integrate a web-application with this wallet?</li>
        </ul>
        <p>
          There are no guides available yet. Feel free to <a
            href="https://nem2.slack.com/"
            class="mx-1"
          >ask questions in the #sig-client Slack channel!</a>
        </p>
      </v-flex>
    </v-layout>
  </v-layout>
</template>
<script>
export default {};
</script>
<style scoped>
.sub-headline {
  font-size: 20px;
  font-weight: 400;
}
.faq {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 0.5em;
}
</style>
