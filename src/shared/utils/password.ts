import { compareSync, hashSync } from 'bcryptjs';

export const getHash = (password: string): string => {
  return hashSync(password, 10);
};

export const compare = (password: string, userPassword: string): boolean => {
  return compareSync(password, userPassword);
};
