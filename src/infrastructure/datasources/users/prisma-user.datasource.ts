import { UserDataSource } from "../../../domain/datasources/users/user.datasource";
import { UserOptions, AuthType, RolType } from "../../../domain/entities/users/user.entity";
import { prisma } from "../../database/prisma";

export class PrismaUserDataSource implements UserDataSource {
  
  async createUser(user: UserOptions): Promise<UserOptions> {

    console.log("User data received:", user);

    
    const newUser = await prisma.user.create({
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        password: user.password,
        phone: user.phone,
        authType: user.authType,
        rol: user.rol,
        name: user.name,
        email: user.email,
        image: user.image,
        createdAt: user.createdAt || new Date(),
        updatedAt: user.updatedAt || new Date(),
      },
    });

    return {
      ...newUser,
      authType: newUser.authType as AuthType,
      rol: newUser.rol as RolType,
    };
  }
  async updateUser(user: UserOptions): Promise<UserOptions> {
    console.log("User data", user);
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
          firstName: user.firstName,
          lastName: user.lastName,
          password: user.password,
          phone: user.phone,
          authType: user.authType,
          rol: user.rol,
          name: user.name,
          email: user.email,
          image: user.image,
          createdAt: user.createdAt || new Date(),
          updatedAt: user.updatedAt || new Date(),
        }

    })

    return {
      ...updatedUser,
      authType: updatedUser.authType as AuthType,
      rol: updatedUser.rol as RolType,
    };
  }
  async findByEmail(email: string): Promise<UserOptions | null> {
  const user = await prisma.user.findUnique({
    where: { 
      email: email
     }
  });

  if (!user) return null;

  return {
    ...user,
    authType: user.authType as AuthType,
    rol: user.rol as RolType,
  };
}

}
