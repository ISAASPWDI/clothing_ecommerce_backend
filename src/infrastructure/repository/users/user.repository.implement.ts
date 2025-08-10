import { UserDataSource } from "../../../domain/datasources/users/user.datasource";
import { UserOptions } from "../../../domain/entities/users/user.entity";
import { UserRepository } from "../../../domain/repository/users/user.repository";

export class UserRepositoryImpl implements UserRepository {
    constructor(
        private readonly userDataSource: UserDataSource
    ) {}
    updateUser(user: UserOptions): Promise<UserOptions> {
        return this.userDataSource.updateUser(user);
    }
    createUser(user: UserOptions): Promise<UserOptions> {
        return this.userDataSource.createUser(user);
    }
    findByEmail(email: string): Promise<UserOptions | null> {
        return this.userDataSource.findByEmail(email);
    }
}