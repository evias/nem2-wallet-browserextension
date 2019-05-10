/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/**
 * Copyright (C) 2019 Contributors as noted in the AUTHORS file
 *
 * This file is part of nem2-wallet-browserextension.
 *
 * nem2-wallet-browserextension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * nem2-wallet-browserextension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with nem2-wallet-browserextension.  If not, see <http://www.gnu.org/licenses/>.
 */

const state = {
  multisigList: '123multisigList',
  cosignatoryList: '321cosignatoryList',
};

const getters = {
  GET_MULTISIG() {
    return state.multisigList;
  },
  GET_COSIGNATORY() {
    return state.cosignatoryList;
  },
};

const mutations = {
  SET_MULTISIGN(state, newMultisigList) {
    state.multisigList = newMultisigList;
  },
  SET_COSIGNATORY(state, newCosignatoryList) {
    state.cosignatoryList = newCosignatoryList;
  },
};

const actions = {

};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
