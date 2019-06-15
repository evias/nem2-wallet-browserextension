import { Wallet, WoWallet, walletTypes } from './wallet-types';

export const walletsToJSON = wallets => JSON
  .stringify(wallets.map((wallet) => {
    switch (wallet.walletType) {
    case walletTypes.SIMPLE_WALLET:
      return {
        name: wallet.name,
        simpleWallet: wallet.simpleWallet,
        walletType: wallet.walletType,
        node: wallet.node,
        publicAccount: wallet.publicAccount,
      };
    case walletTypes.WATCH_ONLY_WALLET:
      return {
        name: wallet.name,
        walletType: wallet.walletType,
        node: wallet.node,
        publicAccount: wallet.publicAccount,
      };
    default: return [];
    }
  }));

export const jsonToWallets = async (json) => {
  try {
    const proms = JSON.parse(json).map((wallet) => {
      switch (wallet.walletType) {
      case walletTypes.SIMPLE_WALLET:
        return new Wallet(wallet).retrieve();

      case walletTypes.WATCH_ONLY_WALLET:
        return new WoWallet(wallet).retrieve();
      default:
        return {};
      }
    });

    const wallets = await Promise.all(proms);

    return wallets;
  } catch (error) {
    throw new Error(error);
  }
};
