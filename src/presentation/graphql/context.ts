import { JwtService } from "../jwt/jwt.service";
import { ExpressContext } from "apollo-server-express";

export interface GraphQLContext {
  user?: {
    userId: string;
    email: string;
    name: string;
    firstName: string;
    lastName: string;
    image?: string;
    phone: string;
    rol: string;
    authType: string;
  } | null;
}

export const createContext = async ({ req }: ExpressContext): Promise<GraphQLContext> => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    // No hay token: consulta pública
    return { user: null }; // Token inválido: contexto sin usuario
  }

  try {
    // Si hay token: consulta privada
    const payload = JwtService.verify(token);
    return {
      user: {
        userId: payload.id,
        email: payload.email,
        name: payload.name,
        firstName: payload.firstName,
        lastName: payload.lastName,
        image: payload.image,
        phone: payload.phone,
        rol: payload.rol,
        authType: payload.authType,
      },
    };
  } catch (error) {
    console.error("❌ Error al verificar el token:", error);
    return { user: null }; // Token inválido: contexto sin usuario
  }
};
