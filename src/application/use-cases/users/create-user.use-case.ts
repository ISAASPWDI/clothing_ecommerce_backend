import { PasswordHasher } from "../../../domain/adapters/password-hasher.adapter";
import { UserOptions } from "../../../domain/entities/users/user.entity";
import { UserRepository } from "../../../domain/repository/users/user.repository";

interface CreateUserCase{
    execute: (user: UserOptions) => Promise<UserOptions>;
}
export class CreateUserUseCase implements CreateUserCase{
    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordHasher: PasswordHasher
    ){}
    async execute(user: UserOptions): Promise<UserOptions> {
        if( typeof user.password === 'string' && user.password){
            user.password = await this.passwordHasher.hash(user.password);
        }
        return this.userRepository.createUser(user);
    }
}