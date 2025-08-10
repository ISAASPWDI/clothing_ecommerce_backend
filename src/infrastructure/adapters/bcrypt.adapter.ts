import { PasswordHasher } from "../../domain/adapters/password-hasher.adapter";
import * as bcrypt from 'bcrypt';

export class BcryptAdapter implements PasswordHasher {
    constructor(
        private readonly saltRounds: number = 10
    ){}

    hash(password: string): Promise<string> {
        return bcrypt.hash(password, this.saltRounds);
    }
    compare(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }

}