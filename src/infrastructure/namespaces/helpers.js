import { NamespaceType } from 'nem2-sdk';
import { PARAMS } from '../../constants';

/* eslint-disable import/prefer-default-export */
export const validateNamespaceName = (str, type) => {
  if (type === NamespaceType.RootNamespace) {
    return RegExp(`^[a-z0-9-_]{1,${PARAMS.NAMESPACE_MAX_LENGTH}}$`).test(str);
  }
  return RegExp(`^[a-z0-9-_.]{1,${PARAMS.NAMESPACE_MAX_LENGTH}}$`).test(str);
};
