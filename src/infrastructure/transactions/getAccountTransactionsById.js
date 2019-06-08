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
    AccountHttp, NetworkType, PublicAccount, QueryParams, BlockHttp,
} from 'nem2-sdk';
import {
    toArray, flatMap, map, concatMap,
} from 'rxjs/operators';

import { formatTransactions } from './formatTransactions';
import { timestampNemesisBlock } from '../network/types';

const getAccountTransactionsById = (
  { wallet, currentId, activeNode },
) => new Promise(async (resolve, reject) => {
  try {
      const accountHttp = new AccountHttp(activeNode);
      const blockHttp = new BlockHttp(activeNode);
      const pageSize = 10;
      const publicAccount = wallet.isWatchOnly
        ? wallet.publicAccount
        : PublicAccount.createFromPublicKey(wallet.account.publicKey, NetworkType.MIJIN_TEST);
      accountHttp
          .transactions(publicAccount, new QueryParams(pageSize, currentId))
          .pipe(
              flatMap(x => x),
              concatMap(x => blockHttp
                .getBlockByHeight(x.transactionInfo.height.compact()).toPromise(),
              (x, res) => (
                {
                  ...x,
                  timestamp: res.timestamp.compact() / 1000 + timestampNemesisBlock,
                })),
              map(formatTransactions),
              flatMap(x => x),
              toArray(),
          )
          .subscribe(
            formattedTransactions => resolve(formattedTransactions),
            // eslint-disable-next-line no-console
            (error) => { console.error(error); resolve(false); },
          );
  } catch (error) {
      reject(error);
  }
});
export default getAccountTransactionsById;
