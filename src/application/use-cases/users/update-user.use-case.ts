import { PasswordHasher } from "../../../domain/adapters/password-hasher.adapter";
import { AuthType, UserOptions } from "../../../domain/entities/users/user.entity";
import { UserRepository } from "../../../domain/repository/users/user.repository";

interface UpdateUserCase {
  execute: (user: UserOptions, authUser: { userId: string; email: string }) => Promise<UserOptions>;
}

export class UpdateUserUseCase implements UpdateUserCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher
  ) {}

  async execute(user: UserOptions, authUser: { userId: string; email: string }): Promise<UserOptions> {
    // Verificación de permisos: Solo puedes actualizarte a ti mismo
    console.log("authUser.userId:", authUser.userId);
console.log("user.id:", user.id);

    if (authUser.userId !== user.id) {
      throw new Error("Token inválido");
    }

    const existingUser = await this.userRepository.findByEmail(user.email);

    if (!existingUser) {
      throw new Error("Usuario no encontrado.");
    }

    if (typeof user.password === 'string' && user.password && user.authType === AuthType.MANUAL) {
      if (existingUser.password === user.password) {
        throw new Error("La contraseña no puede ser la misma que la anterior.");
      }
      user.password = await this.passwordHasher.hash(user.password);
    }

    if (user.authType === AuthType.PROVIDER && user.password) {
      throw new Error("La contraseña no deberia ser proporcionado por la autenticación de proveedor");
    }

    return this.userRepository.updateUser(user);
  }
}
