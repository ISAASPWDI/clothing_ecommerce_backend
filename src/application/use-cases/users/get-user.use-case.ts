import { JwtService } from "../../../presentation/jwt/jwt.service";
import { UserOptions } from "../../../domain/entities/users/user.entity";
import { UserRepository } from "../../../domain/repository/users/user.repository";

interface GetUserCase {
    execute: (email: string) => Promise<UserOptions | null>;
}
export class GetUser implements GetUserCase {
    constructor(
        private readonly userRepository: UserRepository,
    ) { }
    async execute(email: string): Promise<UserOptions | null> {
        const user = await this.userRepository.findByEmail(email);
        
        if (!user) return null;
        
        // Generamos un nuevo token si es necesario
        const token = JwtService.sign({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            name: user.name,
            rol: user.rol,
            authType: user.authType,
            phone: user.phone,
        });
        
        const userWithToken = {
            ...user,
            token
          };
        return userWithToken
    }
}