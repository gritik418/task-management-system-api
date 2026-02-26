import bcrypt from "bcrypt";

export const hashValue = async (
  value: string,
  rounds: number = 10,
): Promise<string> => {
  return bcrypt.hash(value, rounds);
};

export const compareValue = async (
  value: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(value, hash);
};
