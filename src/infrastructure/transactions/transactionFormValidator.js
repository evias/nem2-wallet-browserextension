import ErrorMessage from '../errorMessage/error-message';
import { FilterType } from './transactions-types';

function checkMosaic(pointer, errorMessage) {
  const { filterList } = pointer;
  filterList.every((item) => {
    const filter = item.hexId;
    if (!filter || filter.trim() === '') {
      errorMessage.message.push(ErrorMessage.MOSAIC_NULL);
      return false;
    }
    if (filter.length < 16) {
      errorMessage.message.push(ErrorMessage.MOSAIC_ERROR);
      return false;
    }
    return true;
  });
  return errorMessage;
}

function checkAddress(pointer, errorMessage) {
  const { filterList } = pointer;
  filterList.every((item) => {
    const filter = item.hexId;
    if (!filter || filter.trim() === '') {
      errorMessage.message.push(ErrorMessage.ADDRESS_NULL);
      return false;
    }
    if (filter.length < 40) {
      errorMessage.message.push(ErrorMessage.ADDRESS_ERROR);
      return false;
    }
    return true;
  });
  return errorMessage;
}

function checkCommon(pointer, errorMessage) {
  const { maxFee, generationHash, filterList } = pointer;
  if (maxFee < 0) {
    errorMessage.message.push(ErrorMessage.MAX_FEE_ERROR);
    return errorMessage;
  }
  if (!generationHash || generationHash.trim() === '') {
    errorMessage.message.push(ErrorMessage.GENERATION_HASH_NULL);
    return errorMessage;
  }
  if (generationHash.length !== 64) {
    errorMessage.message.push(ErrorMessage.GENERATION_HASH_ERROR);
    return errorMessage;
  }
  if (filterList.length <= 0) {
    errorMessage.message.push(ErrorMessage.FILTER_LIST_NULL);
    return errorMessage;
  }
  return errorMessage;
}

export const transferValidator = (pointer) => {
  const {
    userPrivateKey, generationHash, txRecipient, txAmount, txMaxFee,
  } = pointer;
  /* eslint-disable */
  let errorMessage = {
    message: [],
    disabled: true,
  };
  if (!userPrivateKey || userPrivateKey.trim() === '') {
    errorMessage.message.push(ErrorMessage.PRIVATE_KEY_NULL);
    return errorMessage;
  }
  if (userPrivateKey.length < 64) {
    errorMessage.message.push(ErrorMessage.PRIVATE_KEY_ERROR);
    return errorMessage;
  }
  if (!generationHash || generationHash.trim() === '') {
    errorMessage.message.push(ErrorMessage.GENERATION_HASH_NULL);
    return errorMessage;
  } if (generationHash.length !== 64) {
    errorMessage.message.push(ErrorMessage.GENERATION_HASH_ERROR);
    return errorMessage;
  }

  if (!txRecipient || txRecipient.trim() === '') {
    errorMessage.message.push(ErrorMessage.ADDRESS_NULL);
    return errorMessage;
  } if (txRecipient.length < 40) {
    errorMessage.message.push(ErrorMessage.ADDRESS_ERROR);
    return errorMessage;
  }
  if (txAmount < 0) {
    errorMessage.message.push(ErrorMessage.TX_AMOUNT_ERROR);
    return errorMessage;
  }
  if (txMaxFee < 0) {
    errorMessage.message.push(ErrorMessage.MAX_FEE_ERROR);
    return errorMessage;
  }
  errorMessage.disabled = false;
  return errorMessage;
};

export const filterValidator = (pointer) => {
  const { filterType } = pointer;
  let errorMessage = {
    message: [],
    disabled: true,
  };
  errorMessage = checkCommon(pointer, errorMessage);
  if (errorMessage.length !== 0) {
    return errorMessage;
  }
  switch (filterType) {
  case FilterType.ADDRESS_FILTER:
    errorMessage = checkAddress(pointer, errorMessage);
    break;
  case FilterType.MOSAIC_FILTER:
    errorMessage = checkMosaic(pointer, errorMessage);
    break;
  default: errorMessage = [];
  }
  errorMessage.disabled = false;
  return errorMessage;
}

export const accountLinkValidator = (pointer) => {
  const { remoteAccountKey, generationHash, maxFee } = pointer;
  let errorMessage = {
    message: [],
    disabled: true,
  };
  if (!generationHash || generationHash.trim() === '') {
    errorMessage.message.push(ErrorMessage.GENERATION_HASH_NULL);
    return errorMessage;
  } if (generationHash.length !== 64) {
    errorMessage.message.push(ErrorMessage.GENERATION_HASH_ERROR);
    return errorMessage;
  }
  if (remoteAccountKey.trim().length !== 64) {
    errorMessage.message.push(ErrorMessage.PUBLIC_KEY_ERROR);
    return errorMessage;
  }
  if (maxFee < 0) {
    errorMessage.message.push(ErrorMessage.MAX_FEE_ERROR);
    return errorMessage;
  }
  errorMessage.disabled = false;
  return errorMessage;
}
