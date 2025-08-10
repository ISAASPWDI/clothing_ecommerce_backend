import { CreateUserUseCase } from "../../application/use-cases/users/create-user.use-case";

import { AuthType, RolType } from "../../domain/entities/users/user.entity";
import { UserRepositoryImpl } from "../../infrastructure/repository/users/user.repository.implement";
import { PrismaUserDataSource } from "../../infrastructure/datasources/users/prisma-user.datasource";
import { GraphQLError } from "graphql";
import { BcryptAdapter } from "../../infrastructure/adapters/bcrypt.adapter";
import { UpdateUserUseCase } from "../../application/use-cases/users/update-user.use-case";
import { GraphQLContext } from "./context";
import { CreateCategoryUseCase } from "../../application/use-cases/products/categories/create-category.user-case";
import { CategoryRepositoryImpl } from "../../infrastructure/repository/products/category.repository.implement";
import { PrismaCategoryDataSource } from "../../infrastructure/datasources/products/prisma-category.datasource";
import { UpdateCategoryUseCase } from "../../application/use-cases/products/categories/update-category.user-case";
import { DeleteCategoryUseCase } from "../../application/use-cases/products/categories/delete-category.user-case";
import { CategoryResponseDTO } from "../../application/dtos/responses/categories/CategoryResponseDTO";
import { CategoryDTO } from "../../application/dtos/categories/CategoryDTO";
import { Category } from "../../domain/entities/products/category.entity";

interface CreateUserArgs {
  data: {
    id: string;
    addressId?: number;
    firstName?: string;
    lastName?: string;
    password: string;
    phone?: string;
    authType: AuthType;
    rol: RolType;
    name?: string;
    email: string;
    emailVerified?: Date;
    image?: string;
  };
}
interface UpdateUserArgs {
  data: {
    id: string;
    addressId?: number;
    firstName?: string;
    lastName?: string;
    password: string;
    phone?: string;
    authType: AuthType;
    rol: RolType;
    name?: string;
    email: string;
    emailVerified?: Date;
    image?: string;
  };
}
interface CreateCategoryArgs {
  data: {
    id: number;
    name: string;
    slug: string;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
  }
}
interface UpdateCategoryArgs {
  data: {
    id: number;
    name: string;
    slug: string;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
  }
}


const prismaUserRepository = new UserRepositoryImpl(
  new PrismaUserDataSource()
);
const prismaCategoryRepository = new CategoryRepositoryImpl(
  new PrismaCategoryDataSource()
)
const passwordHasher = new BcryptAdapter();
const createUser = new CreateUserUseCase(prismaUserRepository, passwordHasher);
const updateUser = new UpdateUserUseCase(prismaUserRepository, passwordHasher);
const createCategory = new CreateCategoryUseCase(prismaCategoryRepository);
const updateCategory = new UpdateCategoryUseCase(prismaCategoryRepository);
const deleteCategory = new DeleteCategoryUseCase(prismaCategoryRepository)
export const mutations = {
  //? USUARIOS
  createUser: async (_: unknown, args: CreateUserArgs) => {
    try {
      return await createUser.execute(args.data);

    } catch (error: any) {
      if (error.code === "P2002") {
        throw new GraphQLError("El correo ya está registrado.", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      console.error("Error en createUser:", error);
      throw new GraphQLError("Error interno del servidor.", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  },
  updateUser: async (_: unknown, args: UpdateUserArgs, context: GraphQLContext) => {
    try {
      if (!context.user) {
        throw new GraphQLError("No autenticado", {
          extensions: { code: "UNAUTHORIZED" },
        });
      }

      return await updateUser.execute(args.data, context.user); // ahora pasas solo el user desde el contexto

    } catch (error: any) {
      if (error.message === "Usuario no encontrado.") {
        throw new GraphQLError("Usuario no encontrado.", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      if (error.message === "Token inválido") {
        throw new GraphQLError("No tienes permisos para actualizar este usuario.", {
          extensions: { code: "UNAUTHORIZED" },
        });
      }

      if (error.message === "La contraseña no puede ser la misma que la anterior.") {
        throw new GraphQLError("La contraseña no puede ser la misma que la anterior.", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      if (error.message === "La contraseña no deberia ser proporcionado por la autenticación de proveedor") {
        throw new GraphQLError("No se puede establecer contraseña para cuentas con autenticación externa.", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      console.error("Error en updateUser:", error);
      throw new GraphQLError("Error interno del servidor.", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  },
  //? CATEGORIAS
  createCategory: async (_:unknown, args: CategoryDTO) => {
    const categoryEntity = new Category({
        id: args.id,
        name: args.name,
        slug: args.slug,
        metaDescription: args.metaDescription ?? null, 
        metaKeywords: args.metaKeywords ?? null,
        metaTitle: args.metaTitle ?? null
      });
    const created = await createCategory.execute(categoryEntity)
    return new CategoryResponseDTO(created);
  },
  updateCategory: async (_:unknown, args: CategoryDTO) => {
      const categoryEntity = new Category({
        id: args.id,
        name: args.name,
        slug: args.slug
      });
      const updated = await updateCategory.execute(categoryEntity);
      return new CategoryResponseDTO(updated);
  },
  deleteCategory: async(_:unknown, args: number) => {
    return deleteCategory.execute(args)
  }
}