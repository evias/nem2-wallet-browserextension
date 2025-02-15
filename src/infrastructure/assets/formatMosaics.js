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

import { Address } from 'nem2-sdk';

const sortAlpha = (arr) => {
  if (arr) {
    return arr.sort((a, b) => {
      const nameA = a.name;
      const nameB = b.name;
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
  }
  return [];
};

export const sortMosaics = (mosaics) => {
  const catCurrency = typeof mosaics.find(m => m.name === 'cat.currency') !== 'undefined'
    ? [mosaics.find(m => m.name === 'cat.currency')]
    : [];

  const notPrimary = mosaics.filter(m => (
    m.name !== 'cat.currency'
  ));

  const notExpired = sortAlpha(notPrimary.filter(m => m.active === true));
  const expired = sortAlpha(notPrimary.filter(m => m.active === false));

  return [
    ...catCurrency,
    ...notExpired,
    ...expired,
  ];
};

export const formatMosaics = (mosaic, blockHeight) => {
  const height = mosaic.mosaicInfo.height.compact();
  const duration = mosaic.mosaicInfo.duration.compact();
  const endHeight = duration === 0 ? 0 : height + duration;

  return {
    id: mosaic.mosaicInfo.mosaicId.toHex(),
    mosaicId: mosaic.mosaicInfo.mosaicId,
    metaId: mosaic.mosaicInfo.metaId,
    balance: mosaic.relativeAmount().toString(10),
    amount: mosaic.amount.compact(),
    active: duration === 0
      ? true
      : endHeight - blockHeight > 0,
    divisibility: mosaic.mosaicInfo.divisibility,
    endHeight,
    supply: mosaic.mosaicInfo.supply.compact(),
    supplyMutable: mosaic.mosaicInfo.isSupplyMutable(),
    transferable: mosaic.mosaicInfo.isTransferable(),
    owner: new Address(mosaic.mosaicInfo.owner.address.address).pretty(),
  };
};
