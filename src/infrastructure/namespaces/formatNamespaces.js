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

import { UInt64, Address, AliasType } from 'nem2-sdk';

// eslint-disable-next-line import/prefer-default-export
export const formatNamespaces = namespacesInfo => namespacesInfo.filter((ns, index, namespaces) => {
  for (let i = 0; i < index; i += 1) {
    if (ns === namespaces[i]) return false;
  }
  return true;
}).sort((a, b) => {
  const nameA = a.namespaceInfo.metaId;
  const nameB = b.namespaceInfo.metaId;
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
}).map((ns, index, original) => {
  const name = ns.namespaceInfo.levels.map(level => original
    .find(n => n.namespaceInfo.id.equals(level)))
    .map(n => n.namespaceName.name).join('.');

  let aliasText = '';
  if (ns.namespaceInfo.alias.type === AliasType.Mosaic) {
    aliasText = new UInt64(ns.namespaceInfo.alias.mosaicId).toHex().toUpperCase();
  }
  if (ns.namespaceInfo.alias.type === AliasType.Address) {
    aliasText = Address.createFromEncoded(ns.namespaceInfo.alias.address).pretty();
  }

  return {
    name,
    namespaceType: ns.namespaceInfo.type,
    endHeight: ns.namespaceInfo.endHeight.compact(),
    hexId: ns.namespaceInfo.id.toHex().toUpperCase(),
    aliasType: ns.namespaceInfo.alias.type,
    aliasText,
  };
});
