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

/* eslint-disable indent */
import {
 flatMap, toArray, map, concatMap,
} from 'rxjs/operators';

import {
  MosaicService,
  AccountHttp,
  MosaicHttp,
  ChainHttp,
} from 'nem2-sdk';
import { formatMosaics, sortMosaics } from './formatMosaics';

const getMosaicsByAddress = async (wallet, activeNode) => new Promise(async (resolve, reject) => {
    try {
      const { address } = wallet.publicAccount;
      const endpoint = activeNode;
      const mosaicHttp = new MosaicHttp(endpoint);
      const mosaicService = new MosaicService(
        new AccountHttp(endpoint),
        mosaicHttp,
      );

      // @TODO: BlockHeight at a higher level, sync with the network
      const chainHttp = new ChainHttp(endpoint);
      const blockHeight = (await chainHttp
        .getBlockchainHeight()
        .toPromise()).compact();

      mosaicService
        .mosaicsAmountViewFromAddress(address)
        .pipe(
          flatMap(x => x),
          map(mosaic => formatMosaics(mosaic, blockHeight)),
          toArray(),
          concatMap(mosaics => mosaicHttp.getMosaicsNames(
              mosaics.map(({ mosaicId }) => mosaicId),
            ).toPromise(),
              (mosaics, res) => {
                const mosaicsWithNames = [];
                res.forEach((r) => {
                  const mosaicToUpdate = mosaics
                    .find(({ id }) => id === r.mosaicId.id.toHex());
                  const name = r.names.length > 0
                    ? r.names[0].name : false;
                  mosaicsWithNames.push({ ...mosaicToUpdate, name });
                });
                return mosaicsWithNames;
              }),
        )
        .subscribe(
          (x) => {
            if (x.length !== 0) {
              resolve(sortMosaics(x));
            } else {
              resolve([]);
            }
          },
          err => reject(err),
        );
    } catch (error) {
      reject(error);
    }
  });

export default getMosaicsByAddress;
