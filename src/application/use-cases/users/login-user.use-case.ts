import { JwtService } from "../../../presentation/jwt/jwt.service";
import { PasswordHasher } from "../../../domain/adapters/password-hasher.adapter";
import { UserOptions } from "../../../domain/entities/users/user.entity";
import { UserRepository } from "../../../domain/repository/users/user.repository";

interface LoginUserCase {
    execute: (email: string, password: string) => Promise<UserOptions>;
}
export class LoginUser implements LoginUserCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordHasher: PasswordHasher
    ) { }
    async execute(email: string, password: string | undefined): Promise<UserOptions> {
        const user = await this.userRepository.findByEmail(email);
        console.log("Usuario obtenido:", user);
        if (!user) throw new Error("No se encontró al usuario");

        if (user.authType === "PROVIDER") {
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
              
              return userWithToken;
        }
        if (!user.email || !user.password) {
            throw new Error("Por favor, rellena todos los campos");
        }
        if (!user.password || !password) {
            throw new Error("La contraseña no puede estar vacía");
        }

        const isValidPassword = await this.passwordHasher.compare(password, user.password);

        if (!isValidPassword) throw new Error("La contraseña no es válida");

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
          
          return userWithToken;
    }
}