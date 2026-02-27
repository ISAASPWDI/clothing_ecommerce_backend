import { GraphQLError } from "graphql";
import { AddressResponseDTO } from "../../application/dtos/responses/users/addresses/address-response.dto";
import { AuthenticateUser } from "../../application/use-cases/auth/authenticate-user.use-case";
import { GetAllAgesUseCase } from "../../application/use-cases/products/ages/get-all-ages.use-case";
import { GetAllCategoriesUseCase } from "../../application/use-cases/products/categories/get-all-categories.use-case";
import { GetAllColorsUseCase } from "../../application/use-cases/products/colors/get-all-colors.use-case";
import { GetProductsBySlugUseCase } from "../../application/use-cases/products/find-product-by-slug.use-case";
import { GetRelatedProductsUseCase } from "../../application/use-cases/products/find-related-products.use-case";
import { GetAllGenresUseCase } from "../../application/use-cases/products/genres/get-all-genres.use-case";
import { GetProductsByRelationUseCase } from "../../application/use-cases/products/get-product-by-relation.use-case";
import { GetProductsUseCase } from "../../application/use-cases/products/get-product.use-case";
import { GetAllSizesUseCase } from "../../application/use-cases/products/sizes/get-all-sizes.use-case";
import { GetAddressByIdUseCase } from "../../application/use-cases/users/addresses/get-address-by-id.use-case";
import { GetAddressesUseCase } from "../../application/use-cases/users/addresses/get-addresses.use-case";
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
import { PrismaAddressDataSource } from "../../infrastructure/datasources/users/addresses/prisma-address.datasource";
import { PrismaUserDataSource } from "../../infrastructure/datasources/users/prisma-user.datasource";
import { AgeRepositoryImpl } from "../../infrastructure/repository/products/age.repository.implement";
import { CategoryRepositoryImpl } from "../../infrastructure/repository/products/category.repository.implement";
import { ColorRepositoryImpl } from "../../infrastructure/repository/products/color.repository.implement";
import { GenreRepositoryImpl } from "../../infrastructure/repository/products/genre.repository.implement";
import { ProductRepositoryImpl } from "../../infrastructure/repository/products/product.repository.implement";
import { SizeRepositoryImpl } from "../../infrastructure/repository/products/size.repository.implement";
import { AddressRepositoryImpl } from "../../infrastructure/repository/users/addresses/address-repository.implement";
import { UserRepositoryImpl } from "../../infrastructure/repository/users/user.repository.implement";
import { GetOrdersPaginatedUseCase } from "../../application/use-cases/orders/get-orders-paginated.use-case";
import { GetUserOrdersPaginatedUseCase } from "../../application/use-cases/orders/get-user-orders-paginated.use-case";
import { OrderRepositoryImpl } from "../../infrastructure/repository/orders/orderRepository.impl";
import { PrismaOrderDataSource } from "../../infrastructure/datasources/orders/prisma-order.datasource";
import { GetOrderDetailUseCase } from "../../application/use-cases/orders/get-order-detail.use-case";
import { GetMyOrderDetailUseCase } from "../../application/use-cases/orders/get-my-order-detail.use-case";
import { OrderDetailResponseDTO } from "../../application/dtos/orders/orderDetail.response.dto";


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

const addressRepository = new AddressRepositoryImpl(
  new PrismaAddressDataSource()
)
const orderRepository = new OrderRepositoryImpl(
  new PrismaOrderDataSource()
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
const getProductBySlugUseCase = new GetProductsBySlugUseCase(prismaProductRepository)
const getRelatedProductsUseCase = new GetRelatedProductsUseCase(prismaProductRepository)

const getAddressesUseCase = new GetAddressesUseCase(addressRepository);
const getAddressByIdUseCase = new GetAddressByIdUseCase(addressRepository);

// ORDENES

const getOrdersPaginatedUseCase = new GetOrdersPaginatedUseCase(orderRepository);
const getUserOrdersPaginatedUseCase = new GetUserOrdersPaginatedUseCase(orderRepository);
const getOrderDetailUseCase = new GetOrderDetailUseCase(orderRepository);
const getMyOrderDetailUseCase = new GetMyOrderDetailUseCase(orderRepository);


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
interface RelatedProducts {
  productId: number,
  limit: number
}

interface GetAddressByIdArgs {
  id: number;
}
interface GetAddressesByUserArgs {
  userId: string;
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
    // await new Promise((res) => setTimeout(res, 4000));
    return await getProductsByRelationUseCase.execute(args.filterData, args.page, args.minPrice, args.maxPrice, args.sortBy, args.searchTerm)
  },

  getProduct: async (_: unknown, { identifier }: { identifier: string | number }) => {
    console.log("📍 Resolver recibió identifier:", identifier);
    try {
      const result = await getProductBySlugUseCase.execute(identifier);
      console.log("✅ Producto encontrado:", result ? "Sí" : "No");
      return result;
    } catch (error) {
      console.error("❌ Error en resolver:", error);
      throw error;
    }
  },
  getRelatedProducts: async (_: unknown, args: RelatedProducts) => {
    return await getRelatedProductsUseCase.execute(args.productId, args.limit)
    // try {
    //   const products = await productService.findRelatedProducts(productId, limit);
    //   return products;
    // } catch (error) {
    //   console.error('Error fetching related products:', error);
    //   return [];
    // }
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
  },

  //ADDRESSES
  getAddresses: async () => {
    try {
      const addresses = await getAddressesUseCase.execute();
      if (!addresses) return [];

      return addresses.map(address => new AddressResponseDTO(address));
    } catch (error: any) {
      console.error("Error en getAddresses:", error);
      throw new GraphQLError("Error al obtener las direcciones.", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  },
  getAddressesByUser: async (_: unknown, args: GetAddressesByUserArgs) => {
    try {
      const addresses = await getAddressesUseCase.execute();
      if (!addresses) return [];

      // Filtrar por userId
      const userAddresses = addresses.filter(address => address.userId === args.userId);
      return userAddresses.map(address => new AddressResponseDTO(address));
    } catch (error: any) {
      console.error("Error en getAddressesByUser:", error);
      throw new GraphQLError("Error al obtener las direcciones del usuario.", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  },

  // Obtener dirección por ID
  getAddressById: async (_: unknown, args: GetAddressByIdArgs) => {
    try {
      const address = await getAddressByIdUseCase.execute(args.id);
      if (!address) {
        throw new GraphQLError("Dirección no encontrada.", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      return new AddressResponseDTO(address);
    } catch (error: any) {
      console.error("Error en getAddressById:", error);
      if (error instanceof GraphQLError) throw error;

      throw new GraphQLError("Error al obtener la dirección.", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  },
  allOrders: async (_: any, { page, limit }: { page: number; limit: number }, context: any) => {
    try {
      return await getOrdersPaginatedUseCase.execute(page, limit);
    } catch (error: any) {
      console.error("Error en allOrders:", error);
      throw new GraphQLError(error.message || "Error al obtener las órdenes paginadas.", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  },

  myOrdersPaginated: async (_: any, { page, limit }: { page: number; limit: number }, context: any) => {
    try {
      console.log("Este es el contexto : ",context);
      
      if (!context.user.userId) {
        throw new GraphQLError("Usuario no autenticado", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      return await getUserOrdersPaginatedUseCase.execute(context.user.userId, page, limit);
    } catch (error: any) {
      console.error("Error en myOrdersPaginated:", error);
      throw new GraphQLError(error.message || "Error al obtener tus órdenes paginadas.", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  },
myOrderDetail: async (_: any, { externalReference }: { externalReference: string }, context: any) => {
  try {
    if (!context.user.userId) {
      throw new GraphQLError("Usuario no autenticado", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    }


    const order = await getMyOrderDetailUseCase.execute(externalReference, context.user.userId);
    console.log("Order en myOrderDetail:", order);

    if (!order) {
      throw new GraphQLError("Orden no encontrada o no tienes acceso a ella", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    return new OrderDetailResponseDTO(order);
  } catch (error: any) {
    console.error("Error en myOrderDetail:", error);
    throw new GraphQLError(error.message || "Error al obtener el detalle de tu orden.", {
      extensions: { code: error.extensions?.code || "INTERNAL_SERVER_ERROR" },
    });
  }
},
  // //MERCADO PAGO
  // obtenerPago: async (_: unknown, args: ObtenerPagoArgs) => {
  //     try {
  //       const { paymentId } = args;

  //       // Validar que existe el ACCESS_TOKEN
  //       if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
  //         throw new GraphQLError('MERCADOPAGO_ACCESS_TOKEN no configurado', {
  //           extensions: { code: 'INTERNAL_SERVER_ERROR' }
  //         });
  //       }

  //       console.log(`🔍 Consultando pago de MercadoPago: ${paymentId}`);

  //       // Llamar a la API de MercadoPago
  //       const response = await fetch(
  //         `https://api.mercadopago.com/v1/payments/${paymentId}`,
  //         {
  //           method: 'GET',
  //           headers: {
  //             'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
  //             'Content-Type': 'application/json'
  //           }
  //         }
  //       );

  //       if (!response.ok) {
  //         if (response.status === 404) {
  //           throw new GraphQLError('Pago no encontrado en MercadoPago', {
  //             extensions: { code: 'NOT_FOUND' }
  //           });
  //         }

  //         throw new GraphQLError(
  //           `Error al consultar MercadoPago: ${response.statusText}`,
  //           {
  //             extensions: { 
  //               code: 'MERCADOPAGO_ERROR',
  //               status: response.status 
  //             }
  //           }
  //         );
  //       }

  //       const payment: MercadoPagoPayment = await response.json();

  //       console.log('💳 Pago obtenido:', {
  //         id: payment.id,
  //         status: payment.status,
  //         amount: payment.transaction_amount,
  //         external_reference: payment.external_reference
  //       });

  //       // Retornar el pago con la estructura de GraphQL
  //       return {
  //         id: payment.id.toString(),
  //         status: payment.status,
  //         status_detail: payment.status_detail,
  //         external_reference: payment.external_reference,
  //         transaction_amount: payment.transaction_amount,
  //         transaction_amount_refunded: payment.transaction_amount_refunded,
  //         currency_id: payment.currency_id,
  //         date_created: payment.date_created,
  //         date_approved: payment.date_approved,
  //         date_last_updated: payment.date_last_updated,
  //         description: payment.description,
  //         installments: payment.installments,
  //         payment_method_id: payment.payment_method_id,
  //         payment_type_id: payment.payment_type_id,
  //         payer: payment.payer ? {
  //           email: payment.payer.email,
  //           first_name: payment.payer.first_name,
  //           last_name: payment.payer.last_name,
  //           id: payment.payer.id,
  //           identification: payment.payer.identification ? {
  //             type: payment.payer.identification.type,
  //             number: payment.payer.identification.number
  //           } : null
  //         } : null,
  //         card: payment.card ? {
  //           first_six_digits: payment.card.first_six_digits,
  //           last_four_digits: payment.card.last_four_digits,
  //           expiration_month: payment.card.expiration_month,
  //           expiration_year: payment.card.expiration_year,
  //           cardholder: payment.card.cardholder ? {
  //             name: payment.card.cardholder.name,
  //             identification: payment.card.cardholder.identification ? {
  //               type: payment.card.cardholder.identification.type,
  //               number: payment.card.cardholder.identification.number
  //             } : null
  //           } : null
  //         } : null,
  //         transaction_details: payment.transaction_details ? {
  //           net_received_amount: payment.transaction_details.net_received_amount,
  //           total_paid_amount: payment.transaction_details.total_paid_amount,
  //           installment_amount: payment.transaction_details.installment_amount,
  //           overpaid_amount: payment.transaction_details.overpaid_amount
  //         } : null,
  //         additional_info: payment.additional_info ? {
  //           ip_address: payment.additional_info.ip_address,
  //           items: payment.additional_info.items,
  //           payer: payment.additional_info.payer
  //         } : null
  //       };

  //     } catch (error: any) {
  //       console.error('❌ Error en obtenerPago:', error);

  //       if (error instanceof GraphQLError) {
  //         throw error;
  //       }

  //       throw new GraphQLError('Error al obtener el pago de MercadoPago', {
  //         extensions: { code: 'INTERNAL_SERVER_ERROR' }
  //       });
  //     }
  //   }
};
