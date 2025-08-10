export interface PasswordHasher {
    hash(password: string): Promise<string>;
    compare(password: string, hashedPassword: string | null | undefined): Promise<boolean>;
  }