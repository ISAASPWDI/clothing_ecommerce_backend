import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET debe estar definido en las variables de entorno");
}

const EXPIRES_IN = "7d"; // Puede ser "1h", "1d", etc.

export class JwtService {
  static sign(payload: object): string {
    return jwt.sign(payload, JWT_SECRET as string, { expiresIn: EXPIRES_IN });
  }

  static verify(token: string): any {
    try {
      console.log("Clave JWT usada para verificar:", process.env.JWT_SECRET);

      return jwt.verify(token, JWT_SECRET as string);
    } catch (err) {
      throw new Error("Token inválido");
    }
  }
}
