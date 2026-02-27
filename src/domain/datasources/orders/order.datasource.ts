// src/domain/datasources/orders/order.datasource.ts
import { Order, OrderStatus } from "../../entities/orders/order.entity";
import { PaginatedOrders } from "../../entities/orders/paginatedOrders.entity";

export abstract class OrderDataSource {
  abstract createOrder(order: Order): Promise<Order>;
  abstract updateOrderStatus(
    externalReference: string,
    status: OrderStatus,
    mercadoPagoPaymentId?: string,
    paidAt?: Date
  ): Promise<Order>;
  abstract updateOrderPreferenceId(
    orderId: number,
    preferenceId: string
  ): Promise<Order>;
  abstract findByExternalReference(reference: string): Promise<Order | null>;
  abstract findById(id: number): Promise<Order | null>;
  abstract findByUserId(userId: string): Promise<Order[] | null>;
  abstract findAllPaginated(page: number, limit: number): Promise<PaginatedOrders>;
  abstract findByUserIdPaginated(userId: string, page: number, limit: number): Promise<PaginatedOrders>;
}