// graphql/context.ts
import { JwtService } from "../jwt/jwt.service";
import { Request } from "express";

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

// ✅ Apollo Server 5.x: Recibe Request de Express directamente
export const createContext = async (req: Request): Promise<GraphQLContext> => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    // No hay token: consulta pública
    return { user: null };
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