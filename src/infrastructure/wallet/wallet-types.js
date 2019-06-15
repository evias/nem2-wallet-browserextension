/* eslint-disable prefer-destructuring */
// eslint-disable-next-line import/prefer-default-export
import {
  PublicAccount,
  NetworkType,
  Account,
  EncryptedPrivateKey,
  Password,
  SimpleWallet,
  Address,
} from 'nem2-sdk';

import getAccountInfo from '../accountInfo/getAccountInfo';

import { emptyPublicKey } from '../accountInfo/accountInfo-types';

export const walletTypes = {
  SIMPLE_WALLET: 'SIMPLE_WALLET',
  WATCH_ONLY_WALLET: 'WATCH_ONLY_WALLET',
  HD_WALLET: 'HD_WALLET',
};

export class Wallet {
  constructor(walletData) {
    const {
      name,
      node,
      account,
      simpleWallet,
      publicAccount,
    } = walletData;

    this.name = name;
    this.node = node;
    this.account = account || false;
    this.simpleWallet = simpleWallet || false;
    this.publicAccount = publicAccount;
    this.isToBeSaved = true;
    this.walletType = walletTypes.SIMPLE_WALLET;
    delete this.walletData;
  }

  store({ password, locked }) {
    return new Promise((resolve, reject) => {
      try {
        const pass = new Password(password);
        const simpleWallet = SimpleWallet
          .createFromPrivateKey(
            this.name, pass,
            this.account.privateKey, NetworkType.MIJIN_TEST,
          );

        this.simpleWallet = simpleWallet;
        // publicAccount is stored here so we can retrieve the publication
        // just after retrieving the wallet from localStorage,
        // without entering the wallet password.
        const publicAccount = simpleWallet.open(pass).publicAccount;
        this.publicAccount = publicAccount;

        if (locked) {
          this.account = false;
          this.isWatchOnly = true;
        } else {
          this.isWatchOnly = false;
        }

        resolve(this);
      } catch (error) {
        reject(error);
      }
    });
  }

  retrieve() {
    return new Promise((resolve, reject) => {
      try {
        this.isWatchOnly = true;
        this.publicAccount.address = Address
          .createFromRawAddress(this.publicAccount.address.address);
        resolve(this);
      } catch (error) {
        reject(error);
      }
    });
  }

  async open({ password }) {
    return new Promise((resolve, reject) => {
      try {
        const pass = new Password(password);
        const { encryptedKey, iv } = this.simpleWallet.encryptedPrivateKey;

        const privateKey = new EncryptedPrivateKey(encryptedKey, iv)
          .decrypt(pass);

        const account = Account
          .createFromPrivateKey(privateKey, NetworkType.MIJIN_TEST);

        this.account = account;
        this.isWatchOnly = false;

        resolve(this);
      } catch (error) {
        this.isWatchOnly = true;
        const errMsg = error.toString()
          .indexOf('Error: private key has unexpected size') > -1
          ? 'Wrong password, try again!'
          : error;
        reject(errMsg);
      }
    });
  }

  close() {
    this.account = false;
    this.isWatchOnly = true;
    return this;
  }
}

export class WoWallet {
  constructor(walletData) {
    const {
      name,
      address,
      node,
      publicAccount,
    } = walletData;

    if (!address && !publicAccount) {
      throw new Error(
        'address and publicAccount can not be undefined alltogether',
      );
    }

    this.name = name;
    this.account = false;
    this.node = node;
    this.isWatchOnly = true;

    if (publicAccount) {
      this.publicAccount = publicAccount;
    } else {
      this.publicAccount = {};
      this.publicAccount.address = address;
    }

    this.walletType = walletTypes.WATCH_ONLY_WALLET;
    delete this.walletData;
  }

  retrieve() {
    return new Promise((resolve, reject) => {
      try {
        this.isWatchOnly = true;
        this.isToBeSaved = true;
        this.publicAccount.address = Address
          .createFromRawAddress(this.publicAccount.address.address);
        resolve(this);
      } catch (error) {
        reject(error);
      }
    });
  }

  create({ isToBeSaved }) {
    return new Promise(async (resolve) => {
      try {
        this.isToBeSaved = isToBeSaved;

        if (!this.publicAccount.publicKey) {
          const accountInfo = await getAccountInfo(this, this.node);
          if (accountInfo.publicKey !== emptyPublicKey) {
            this.publicAccount = PublicAccount.createFromPublicKey(
              accountInfo.publicKey, NetworkType.MIJIN_TEST,
            );
          }
        }
      } catch (error) {
        this.accountInfo = false;
      }
      resolve(this);
    });
  }
}
