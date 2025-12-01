import { hash, compare } from "bcrypt";

export async function hashPassword(plainText: string): Promise<string> {
  return hash(plainText, 10);
}

export async function verifyPassword(plainText: string, passwordHash: string): Promise<boolean> {
  return compare(plainText, passwordHash);
}