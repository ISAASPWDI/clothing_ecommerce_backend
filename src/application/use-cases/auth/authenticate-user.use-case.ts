import { JwtService } from "../../../presentation/jwt/jwt.service";
import { LoginUser } from "../users/login-user.use-case";

export class AuthenticateUser {
    constructor(private loginUser: LoginUser) {}
  
    async execute(email: string, password?: string) {
      const user = await this.loginUser.execute(email, password);
      if (user.authType === 'PROVIDER' && password) {
        throw new Error('Este usuario solo puede autenticarse con un proveedor externo');
      }

      if (user.authType === 'MANUAL' && !password) {
        throw new Error('Este usuario requiere autenticación con contraseña');
      }
    
      const payload = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        name: user.name,
        email: user.email,
        image: user.image,
        rol: user.rol,
        authType: user.authType,
        phone: user.phone,
      };
  
      const token = JwtService.sign(payload);
  
      return {
        ...payload,
        token,
      };
    }
  }
  