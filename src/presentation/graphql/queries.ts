import { CategoryResponseDTO } from "../../application/dtos/responses/categories/CategoryResponseDTO";
import { AuthenticateUser } from "../../application/use-cases/auth/authenticate-user.use-case";
import { GetAllCategoriesUseCase } from "../../application/use-cases/products/categories/get-all-categories.use-case";
import { GetAllGenresUseCase } from "../../application/use-cases/products/genres/get-all-genres.use-case";
import { GetProductsByRelationUseCase } from "../../application/use-cases/products/get-product-by-relation.use-case";
import { GetProductsUseCase } from "../../application/use-cases/products/get-product.use-case";
import { GetUser } from "../../application/use-cases/users/get-user.use-case";
import { LoginUser } from "../../application/use-cases/users/login-user.use-case";
import { BcryptAdapter } from "../../infrastructure/adapters/bcrypt.adapter";
import { RelationType } from "../../infrastructure/database/helpers/ProductRelationsHelper";
import { PrismaCategoryDataSource } from "../../infrastructure/datasources/products/prisma-category.datasource";
import { PrismaGenreDataSource } from "../../infrastructure/datasources/products/prisma-genre.datasource";
import { PrismaProductDataSource } from "../../infrastructure/datasources/products/prisma-product.datasource";
import { PrismaUserDataSource } from "../../infrastructure/datasources/users/prisma-user.datasource";
import { CategoryRepositoryImpl } from "../../infrastructure/repository/products/category.repository.implement";
import { GenreRepositoryImpl } from "../../infrastructure/repository/products/genre.repository.implement";
import { ProductRepositoryImpl } from "../../infrastructure/repository/products/product.repository.implement";
import { UserRepositoryImpl } from "../../infrastructure/repository/users/user.repository.implement";


const prismaUserRepository = new UserRepositoryImpl(
  new PrismaUserDataSource()
);
const prismaCategoryRepository = new CategoryRepositoryImpl(
  new PrismaCategoryDataSource()
)
const prismaGenreRepository = new GenreRepositoryImpl(
  new PrismaGenreDataSource()
);
const prismaProductRepository = new ProductRepositoryImpl(
  new PrismaProductDataSource()
)
const bcryptAdapter = new BcryptAdapter();
const loginUser = new LoginUser(prismaUserRepository, bcryptAdapter);
const authenticateUser = new AuthenticateUser(loginUser);
const getUserUseCase = new GetUser(prismaUserRepository)
const getAllCategoriesUseCase = new GetAllCategoriesUseCase(prismaCategoryRepository)
const getAllGenresUseCase = new GetAllGenresUseCase(prismaGenreRepository)
const getProductsUseCase = new GetProductsUseCase(prismaProductRepository)
const getProductsByRelationUseCase = new GetProductsByRelationUseCase(prismaProductRepository)

interface LoginOptions {
  email: string;
  password?: string;
}
interface EmailOnly {
  email: string;
}
interface FindProducts {
  relation: RelationType;
  id?: number;
}
interface FindProductsByRelation {
  filterData: { key: string; ids: number[] }[],
  page: number;
}
export const queries = {
  //USER
  findUserByEmail: async (_: unknown, args: LoginOptions) => {
    return await authenticateUser.execute(args.email, args.password);
  },
  getUserByEmail: async (_: unknown, { email }: EmailOnly) => {
    return await getUserUseCase.execute(email);
  },
  //PRODUCT
  // createProduct: async (_:unknown, args) => {

  // },
  findAllProducts: async (_: unknown, args: FindProducts) => {
    const products = await getProductsUseCase.execute(args.relation, args.id);
    return products;
  },

  findProductsByRelation: async(_:unknown, args: FindProductsByRelation) => {
    return await getProductsByRelationUseCase.execute(args.filterData, args.page)
  },
  //GENRE
  getAllGenres: async (_: unknown) => {
    const genres = await getAllGenresUseCase.execute();
    return genres ?? [];
  },
  //CATEGORY
  getAllCategories: async (_: unknown) => {
    const categories = await getAllCategoriesUseCase.execute();
    return categories ?? [];
  },
};
