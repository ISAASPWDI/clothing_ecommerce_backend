export const typeDefs = `
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

  # ✨ NUEVO ENUM PARA ORDERS
  enum OrderStatus {
    Procesando
    Enviado
    Entregado
    PENDING
    PAID
    REJECTED
    CANCELLED
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
  type Address {
    id: Int!
    userId: String!
    firstName: String!
    lastName: String!
    address: String!
    optAddress: String
    city: String!
    zipCode: String!
    phone: String!
  }

  # ✨ NUEVOS TIPOS PARA ORDERS
  type Order {
    id: ID!
    externalReference: String
    userId: String!
    paymentMethodId: Int!
    status: OrderStatus!
    total: Float!
    orderItems: [OrderItem!]!
    customerInfo: CustomerInfo
    mercadoPagoPaymentId: String
    mercadoPagoPreferenceId: String
    createdAt: String!
    paidAt: String
  }

  type OrderItem {
    id: ID!
    orderId: Int!
    productId: Int!
    name: String!
    quantity: Int!
    price: Float!
    selectedColor: String
    selectedSize: String
  }

  type CustomerInfo {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    phone: String!
    address: String!
    apartment: String
    city: String
    province: String
    zipCode: String!
    createdAt: String!
  }

  type PaymentMethod {
    id: ID!
    name: String!
    description: String
    code: String
    settings: String
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
  #INPUTS DE ADDRESS
  input AddressInput {
    userId: String!
    firstName: String!
    lastName: String!
    address: String!
    optAddress: String
    city: String!
    zipCode: String!
    phone: String!
  }
  input UpdateAddressInput {
    userId: String!
    firstName: String!
    lastName: String!
    address: String!
    optAddress: String
    city: String!
    zipCode: String!
    phone: String!
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

  # ✨ NUEVOS INPUTS PARA ORDERS
  input CreateOrderInput {
    items: [OrderItemInput!]!
    customerInfo: CustomerInfoInput!
    total: Float!
    paymentMethodId: Int!
  }

  input OrderItemInput {
    productId: Int!
    name: String!
    quantity: Int!
    price: Float!
    selectedColor: String
    selectedSize: String
  }

  input CustomerInfoInput {
    firstName: String!
    lastName: String!
    email: String!
    phone: String!
    address: String!
    apartment: String
    city: String
    province: String
    zipCode: String!
  }

  # INPUTS DE MERCADO PAGO
  input ItemInput {
    id: String
    title: String!
    quantity: Int!
    unit_price: Float!
    description: String
    category_id: String
    currency_id: String
  }
  input PayerPhoneInput {
    area_code: String
    number: String
  }

  input PayerIdentificationInput {
    type: String
    number: String
  }

  input PayerAddressInput {
    street_name: String
    street_number: Int
    zip_code: String
  }

  input PayerInput {
    email: String!
    name: String
    surname: String
    phone: PayerPhoneInput
    identification: PayerIdentificationInput
    address: PayerAddressInput
  }

  input PaymentMethodsInput {
    excluded_payment_types: [String]
    excluded_payment_methods: [String]
    installments: Int
    default_payment_method_id: String
  }

  input BackUrlsInput {
    success: String!
    failure: String!
    pending: String!
  }

  input PreferenciaInput {
    items: [ItemInput!]!
    payer: PayerInput
    payment_methods: PaymentMethodsInput
    back_urls: BackUrlsInput!
    auto_return: String
    external_reference: String
    statement_descriptor: String
    binary_mode: Boolean
    notification_url: String
    expires: Boolean
    expiration_date_from: String
    expiration_date_to: String
  }

  # Response types
  type BackUrls {
    success: String!
    failure: String!
    pending: String!
  }

  type PreferenciaResponse {
    id: String!
    initPoint: String!
    sandboxInitPoint: String
    autoReturn: String
    backUrls: BackUrls
  }
  type Payment {
    id: ID!
    status: String!
    status_detail: String
    external_reference: String
    transaction_amount: Float!
    transaction_amount_refunded: Float
    currency_id: String!
    date_created: String!
    date_approved: String
    date_last_updated: String!
    description: String
    installments: Int
    payment_method_id: String
    payment_type_id: String
    payer: PaymentPayer
    card: PaymentCard
    transaction_details: TransactionDetails
    additional_info: AdditionalInfo
  }

  type PaymentPayer {
    email: String
    first_name: String
    last_name: String
    id: String
    identification: Identification
  }

  type Identification {
    type: String
    number: String
  }

  type PaymentCard {
    first_six_digits: String
    last_four_digits: String
    expiration_month: Int
    expiration_year: Int
    cardholder: CardHolder
  }

  type CardHolder {
    name: String
    identification: Identification
  }

  type TransactionDetails {
    net_received_amount: Float
    total_paid_amount: Float
    installment_amount: Float
    overpaid_amount: Float
  }

  type AdditionalInfo {
    ip_address: String
    items: [PaymentItem]
    payer: AdditionalInfoPayer
  }

  type PaymentItem {
    id: String
    title: String
    description: String
    picture_url: String
    category_id: String
    quantity: String
    unit_price: String
  }

  type AdditionalInfoPayer {
    first_name: String
    last_name: String
    phone: Phone
    address: AddressMercadoPago
  }

  type Phone {
    area_code: String
    number: String
  }

  type AddressMercadoPago {
    street_name: String
    street_number: String
    zip_code: String
  }

  # NUEVAS TYPES PARA ORDENES

  type PaginationInfo {
  currentPage: Int!
  totalPages: Int!
  totalOrders: Int!
  hasNextPage: Boolean!
  hasPrevPage: Boolean!
}

type PaginatedOrders {
  orders: [Order!]!
  pagination: PaginationInfo!
}
  type OrderDetail {
  id: ID!
  externalReference: String
  userId: String!
  status: OrderStatus!
  total: Float!
  
  # Información de items
  orderItems: [OrderItem!]!
  
  # Información del cliente/dirección de envío
  customerInfo: CustomerInfo
  
  # Información de pago
  paymentMethod: PaymentMethod!
  mercadoPagoPaymentId: String
  mercadoPagoPreferenceId: String
  
  # Fechas
  createdAt: String!
  paidAt: String
  
  # Resumen de la orden
  subtotal: Float!
  itemsCount: Int!
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
    getProduct(identifier: String!): ProductResponse
    getRelatedProducts(productId: Int!, limit: Int = 4): [Product!]!
    #ADDRESS
    getAddresses: [Address!]!
    getAddressById(id: Int!): Address
    getAddressesByUser(userId: Int!): [Address!]!
    # MERCADO PAGO
    obtenerPago(paymentId: ID!): Payment

    # ✨ NUEVAS QUERIES PARA ORDERS
    orderById(id: Int!): Order
    orderByReference(reference: String!): Order
    myOrders: [Order!]!
    paymentMethods: [PaymentMethod!]!

      allOrders(page: Int = 1, limit: Int = 10): PaginatedOrders!
  myOrdersPaginated(page: Int = 1, limit: Int = 10): PaginatedOrders!
  myOrderDetail(externalReference: String!): OrderDetail
  orderDetail(externalReference: String!): OrderDetail
  }
  
  # MUTATIONS
  type Mutation {
    # USUARIOS
    createUser(data: CreateUserInput!): User
    updateUser(data: UpdateUserInput!): User

    # ADDRESSES
    addAddress(input: AddressInput!): Address!
    updateAddress(id: Int!, input: UpdateAddressInput!): Address!
    deleteAddress(id: Int!): Boolean!

    #CATEGORIAS
    createCategory(data: CreateCategoryInput!): Category!
    updateCategory(data: UpdateCategoryInput!): Category!
    deleteCategory(id: Int!): Boolean! 

    # MERCADO PAGO
    crearPreferenciaPago(input: PreferenciaInput!): PreferenciaResponse!

    # ✨ NUEVAS MUTATIONS PARA ORDERS
    crearOrdenYPreferencia(input: CreateOrderInput!): PreferenciaResponse!
    actualizarEstadoOrden(
      externalReference: String!
      status: OrderStatus!
      mercadoPagoPaymentId: String
    ): Order!
  }
`;