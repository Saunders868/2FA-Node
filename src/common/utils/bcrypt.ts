import { compare, hash } from "bcrypt";

export const hashValue = async (value: string, salt: number = 10) =>
  await hash(value, salt);

export const compareValue = async (value: string, hashValue: string) =>
  await compare(value, hashValue);
