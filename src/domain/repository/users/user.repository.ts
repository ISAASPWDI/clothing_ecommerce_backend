import { UserOptions } from "../../entities/users/user.entity";

export abstract class UserRepository {
    abstract createUser(user: UserOptions): Promise<UserOptions>;
    abstract updateUser(user: UserOptions): Promise<UserOptions>;
    abstract findByEmail(email: string): Promise<UserOptions | null>;
}