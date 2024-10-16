import { InternalServerErrorException } from '@nestjs/common';
import * as argon2 from 'argon2';

export async function passwordHash(password: string): Promise<string> {
  try {
    return await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 4,
      parallelism: 2,
      hashLength: 32,
    });
  } catch (err) {
    throw new InternalServerErrorException('Error hashing password');
  }
}

export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch (err) {
    throw new InternalServerErrorException('Error while verifying user');
  }
}