import bcrypt from "bcrypt";

export const hashValue = async (
  value: string,
  rounds: number = 10,
): Promise<string> => {
  return bcrypt.hash(value, rounds);
};
