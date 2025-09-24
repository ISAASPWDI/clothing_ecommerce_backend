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
import { Address } from "../../domain/entities/users/address.entity";
import { CreateAddressUseCase } from "../../application/use-cases/users/addresses/create-address.use-case";
import { UpdateAddressUseCase } from "../../application/use-cases/users/addresses/update-address.use-case";
import { DeleteAddressUseCase } from "../../application/use-cases/users/addresses/delete-address.use-case";
import { GetAddressesUseCase } from "../../application/use-cases/users/addresses/get-addresses.use-case";
import { GetAddressByIdUseCase } from "../../application/use-cases/users/addresses/get-address-by-id.use-case";
import { AddressRepositoryImpl } from "../../infrastructure/repository/users/addresses/address-repository.implement";
import { PrismaAddressDataSource } from "../../infrastructure/datasources/users/addresses/prisma-address.datasource";
import { AddressResponseDTO } from "../../application/dtos/responses/users/addresses/address-response.dto";

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
interface AddAddressArgs {
  input: {
    userId: number;
    firstName: string;
    lastName: string;
    address: string;
    optAddress?: string | null;
    city: string;
    zipCode: string;
    phone: string;
  };
}

interface UpdateAddressArgs {
  id: number;
  input: {
    firstName: string;
    lastName: string;
    address: string;
    optAddress?: string | null;
    city: string;
    zipCode: string;
    phone: string;
  };
}

interface DeleteAddressArgs {
  id: number;
}


const prismaUserRepository = new UserRepositoryImpl(
  new PrismaUserDataSource()
);
const prismaCategoryRepository = new CategoryRepositoryImpl(
  new PrismaCategoryDataSource()
)
const addressRepository = new AddressRepositoryImpl(
  new PrismaAddressDataSource()
)
const passwordHasher = new BcryptAdapter();
const createUser = new CreateUserUseCase(prismaUserRepository, passwordHasher);
const updateUser = new UpdateUserUseCase(prismaUserRepository, passwordHasher);

//categories
const createCategory = new CreateCategoryUseCase(prismaCategoryRepository);
const updateCategory = new UpdateCategoryUseCase(prismaCategoryRepository);
const deleteCategory = new DeleteCategoryUseCase(prismaCategoryRepository)

//Addresses
const createAddressUseCase = new CreateAddressUseCase(addressRepository);
const updateAddressUseCase = new UpdateAddressUseCase(addressRepository);
const deleteAddressUseCase = new DeleteAddressUseCase(addressRepository);
const getAddressByIdUseCase = new GetAddressByIdUseCase(addressRepository);
export const mutations = {
  // USUARIOS
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
  // CATEGORIAS
  createCategory: async (_: unknown, args: CategoryDTO) => {
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
  updateCategory: async (_: unknown, args: CategoryDTO) => {
    const categoryEntity = new Category({
      id: args.id,
      name: args.name,
      slug: args.slug
    });
    const updated = await updateCategory.execute(categoryEntity);
    return new CategoryResponseDTO(updated);
  },
  deleteCategory: async (_: unknown, args: number) => {
    return deleteCategory.execute(args)
  },
  // ADDRESSES

  addAddress: async (_: unknown, args: AddAddressArgs) => {
    try {
      const addressEntity = new Address({
        id: 0, // Se asignará automáticamente en la base de datos
        userId: args.input.userId.toString(),
        firstName: args.input.firstName,
        lastName: args.input.lastName,
        address: args.input.address,
        optAddress: args.input.optAddress ?? null,
        city: args.input.city,
        zipCode: args.input.zipCode,
        phone: args.input.phone,
      });

      const created = await createAddressUseCase.execute(addressEntity);
      return new AddressResponseDTO(created);
    } catch (error: any) {
      console.error("Error en addAddress:", error);

      // Si es un error de validación, lo pasamos tal cual
      if (error.message.includes("requerido") || error.message.includes("obligatorio")) {
        throw new GraphQLError(error.message, {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      throw new GraphQLError("Error interno del servidor.", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  },

  // Actualizar dirección existente
  updateAddress: async (_: unknown, args: UpdateAddressArgs) => {
    try {
      // Primero obtenemos la dirección existente para mantener el userId
      const existingAddress = await getAddressByIdUseCase.execute(args.id);
      if (!existingAddress) {
        throw new GraphQLError("Dirección no encontrada.", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      const addressEntity = new Address({
        id: args.id,
        userId: existingAddress.userId, // Mantenemos el userId original
        firstName: args.input.firstName,
        lastName: args.input.lastName,
        address: args.input.address,
        optAddress: args.input.optAddress ?? null,
        city: args.input.city,
        zipCode: args.input.zipCode,
        phone: args.input.phone,
      });

      const updated = await updateAddressUseCase.execute(addressEntity);
      return new AddressResponseDTO(updated);
    } catch (error: any) {
      console.error("Error en updateAddress:", error);

      if (error instanceof GraphQLError) throw error;

      if (error.message.includes("no encontrada")) {
        throw new GraphQLError("Dirección no encontrada.", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      if (error.message.includes("requerido") || error.message.includes("obligatorio")) {
        throw new GraphQLError(error.message, {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      throw new GraphQLError("Error interno del servidor.", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  },

  // Eliminar dirección
  deleteAddress: async (_: unknown, args: DeleteAddressArgs) => {
    try {
      const deleted = await deleteAddressUseCase.execute(args.id);
      return deleted;
    } catch (error: any) {
      console.error("Error en deleteAddress:", error);

      if (error.message.includes("no encontrada")) {
        throw new GraphQLError("Dirección no encontrada.", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      throw new GraphQLError("Error interno del servidor.", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  },
}