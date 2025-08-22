import { CategoryResponseDTO } from "../../application/dtos/responses/categories/CategoryResponseDTO";
import { AuthenticateUser } from "../../application/use-cases/auth/authenticate-user.use-case";
import { GetAllAgesUseCase } from "../../application/use-cases/products/ages/get-all-ages.use-case";
import { GetAllCategoriesUseCase } from "../../application/use-cases/products/categories/get-all-categories.use-case";
import { GetAllColorsUseCase } from "../../application/use-cases/products/colors/get-all-colors.use-case";
import { GetAllGenresUseCase } from "../../application/use-cases/products/genres/get-all-genres.use-case";
import { GetProductsByRelationUseCase } from "../../application/use-cases/products/get-product-by-relation.use-case";
import { GetProductsUseCase } from "../../application/use-cases/products/get-product.use-case";
import { GetAllSizesUseCase } from "../../application/use-cases/products/sizes/get-all-sizes.use-case";
import { GetUser } from "../../application/use-cases/users/get-user.use-case";
import { LoginUser } from "../../application/use-cases/users/login-user.use-case";
import { BcryptAdapter } from "../../infrastructure/adapters/bcrypt.adapter";
import { RelationType, SortByOptions } from "../../infrastructure/database/helpers/ProductRelationsHelper";
import { PrismaAgeDataSource } from "../../infrastructure/datasources/products/prisma-age.datasource";
import { PrismaCategoryDataSource } from "../../infrastructure/datasources/products/prisma-category.datasource";
import { PrismaColorDataSource } from "../../infrastructure/datasources/products/prisma-color.datasource";
import { PrismaGenreDataSource } from "../../infrastructure/datasources/products/prisma-genre.datasource";
import { PrismaProductDataSource } from "../../infrastructure/datasources/products/prisma-product.datasource";
import { PrismaSizeDataSource } from "../../infrastructure/datasources/products/prisma-size.datasource";
import { PrismaUserDataSource } from "../../infrastructure/datasources/users/prisma-user.datasource";
import { AgeRepositoryImpl } from "../../infrastructure/repository/products/age.repository.implement";
import { CategoryRepositoryImpl } from "../../infrastructure/repository/products/category.repository.implement";
import { ColorRepositoryImpl } from "../../infrastructure/repository/products/color.repository.implement";
import { GenreRepositoryImpl } from "../../infrastructure/repository/products/genre.repository.implement";
import { ProductRepositoryImpl } from "../../infrastructure/repository/products/product.repository.implement";
import { SizeRepositoryImpl } from "../../infrastructure/repository/products/size.repository.implement";
import { UserRepositoryImpl } from "../../infrastructure/repository/users/user.repository.implement";


const prismaUserRepository = new UserRepositoryImpl(
  new PrismaUserDataSource()
);
const prismaCategoryRepository = new CategoryRepositoryImpl(
  new PrismaCategoryDataSource()
)
const prismaColorRepository = new ColorRepositoryImpl(
  new PrismaColorDataSource()
)
const prismaAgeRepository = new AgeRepositoryImpl(
  new PrismaAgeDataSource()
);

const prismaGenreRepository = new GenreRepositoryImpl(
  new PrismaGenreDataSource()
);
const prismaSizeRepository = new SizeRepositoryImpl(
  new PrismaSizeDataSource()
);
const prismaProductRepository = new ProductRepositoryImpl(
  new PrismaProductDataSource()
)
const bcryptAdapter = new BcryptAdapter();
const loginUser = new LoginUser(prismaUserRepository, bcryptAdapter);
const authenticateUser = new AuthenticateUser(loginUser);
const getUserUseCase = new GetUser(prismaUserRepository)
const getAllColorsUseCase = new GetAllColorsUseCase(prismaColorRepository);
const getAllAgesUseCase = new GetAllAgesUseCase(prismaAgeRepository);
const getAllCategoriesUseCase = new GetAllCategoriesUseCase(prismaCategoryRepository)
const getAllGenresUseCase = new GetAllGenresUseCase(prismaGenreRepository)
const getAllSizesUseCase = new GetAllSizesUseCase(prismaSizeRepository)
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
  page: number,
  maxPrice?: number,
  minPrice?: number,
  sortBy?: SortByOptions,
  searchTerm?: string
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

  findProductsByRelation: async (_: unknown, args: FindProductsByRelation) => {
    await new Promise((res) => setTimeout(res, 4000));
    return await getProductsByRelationUseCase.execute(args.filterData, args.page, args.minPrice, args.maxPrice,args.sortBy, args.searchTerm)
  },
  //COLOR
  getAllColors: async (_: unknown) => {
    // await new Promise((res) => setTimeout(res, 4000));
    return await getAllColorsUseCase.execute() ?? [];
  },
  getAllAges: async (_: unknown) => {
    // await new Promise((res) => setTimeout(res, 4000));
    return await getAllAgesUseCase.execute() ?? [];
  },
  //GENRE
  getAllGenres: async (_: unknown) => {
    const genres = await getAllGenresUseCase.execute();
    return genres ?? [];
  },
  //CATEGORY
  getAllCategories: async (_: unknown) => {
    // await new Promise((res) => setTimeout(res, 4000));
    const categories = await getAllCategoriesUseCase.execute();
    return categories ?? [];
  },
  //SIZE
  getAllSizes: async (_: unknown) => {
    return await getAllSizesUseCase.execute() ?? [];
  }
};
