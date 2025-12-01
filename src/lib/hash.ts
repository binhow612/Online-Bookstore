import { hash as bcryptHash, compare as bcryptCompare } from "bcrypt";

export async function hash(plainText: string): Promise<string> {
  return bcryptHash(plainText, 10);
}

export async function compare(plainText: string, hash: string): Promise<boolean> {
  return bcryptCompare(plainText, hash);
}