import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

export const getHash = (password: string): string => {
  const salt = genSaltSync(10);
  return hashSync(password, salt);
};

export const compare = (password: string, userPassword: string): boolean => {
  return compareSync(password, userPassword);
};
