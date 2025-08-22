import { gql } from "apollo-server";

export const typeDefs = gql`
  # DEFINICIÓN DE TIPOS
  enum AuthType {
    MANUAL
    PROVIDER
  }
  enum RolType {
    ADMIN
    USER
  }
  enum RelationType {
    category
    color
    age
    genre
    size
    detail
    image
  }


  # TIPOS DEL SISTEMA
  type User {
    id: ID!
    addressId: Int
    firstName: String
    lastName: String
    phone: String
    authType: AuthType!
    rol: RolType!
    name: String
    email: String!
    emailVerified: String
    image: String
    createdAt: String
    updatedAt: String
    token: String
  }
  type Category {
    id: ID
    name: String
    slug: String
    metaTitle: String 
    metaDescription: String
    metaKeywords: String
  }
  type Size {
    id: ID
    size: String
  }

  type Color {
    id: ID
    color: String
  }
  type Age {
    id: ID
    range: String
  }
  type Genre {
    id: ID
    genre: String
  }
  type Detail {
    id: ID
    key: String
    value: String
  }
  type Image {
    id: ID
    imagePath: String
    alt: String
    sortOrder: Int
    isMain: Boolean
  }
  type Product {
    id: Int!
    name: String!
    slug: String!
    price: Float!
    description: String
    quantity: Int!
    reviewCount: Int!
    metaTitle: String
    metaDescription: String
    metaKeywords: String
  }
  type ProductsWithPagination {
    products: [Product!]!
    isProducts: Boolean!
  }


  # INPUTS DE USUARIOS

  input CreateUserInput {
    firstName: String
    lastName: String
    password: String!
    phone: String
    authType: AuthType!
    rol: RolType!
    name: String
    email: String!
    emailVerified: String
    image: String
  }
  input UpdateUserInput {
    id: String!
    firstName: String
    lastName: String
    password: String!
    phone: String
    authType: AuthType!
    rol: RolType!
    name: String
    email: String!
    emailVerified: String
    image: String
  }

  #INPUTS DE CATEGORIAS

  input CreateCategoryInput {
    name: String!
    slug: String!
    metaTitle: String
    metaDescription: String
    metaKeywords: String
  }
  input UpdateCategoryInput {
    id: Int!
    name: String!
    slug: String!
    metaTitle: String
    metaDescription: String
    metaKeywords: String
  }

  #INPUTS DE PRODUCTOS

  input FilterDataInput {
    key: String!
    ids: [Int!]!
  }
  type ProductResponse {
    id: Int!
    name: String!
    slug: String!
    price: Float!
    description: String
    quantity: Int!
    reviewCount: Int!
    metaTitle: String
    metaDescription: String
    metaKeywords: String

    categories: [Category!]!
    sizes: [Size!]!
    colors: [Color!]!
    ages: [Age!]!
    genres: [Genre!]!
    details: [Detail]
    images: [Image]
  }

  # QUERIES
  type Query {
    # USUARIOS
    findUserByEmail(
      email: String!,
      password: String
    ): User
    getUserByEmail(email: String!): User
    # SIZES
    getAllSizes: [Size]
    # AGES
    getAllAges: [Age]
    # COLORS
    getAllColors: [Color]
    # CATEGORIAS
    getAllCategories: [Category]
    # GENRES
    getAllGenres: [Genre!]!
    # PRODUCTOS
    findAllProducts(relation: RelationType!, id: Int): [ProductResponse!]
    findProductsByRelation(
      filterData: [FilterDataInput!]!, 
      page: Int
      maxPrice: Float
      minPrice: Float
      sortBy: String
      searchTerm: String
    ): ProductsWithPagination!

  }
  
  # MUTATIONS
  type Mutation {
    # USUARIOS
    createUser(data: CreateUserInput!): User
    updateUser(data: UpdateUserInput!): User

    #CATEGORIAS
    createCategory(data: CreateCategoryInput!): Category!
    updateCategory(data: UpdateCategoryInput!): Category!
    deleteCategory(id: Int!): Boolean! 
  }
`;