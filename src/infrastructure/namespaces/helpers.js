/* eslint-disable import/prefer-default-export */
export const validateNamespaceName = str => RegExp('^[a-z0-9-_]{1,64}$')
  .test(str);
