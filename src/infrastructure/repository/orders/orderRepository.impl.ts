// src/infrastructure/repositories/orders/order.repository.impl.ts
import { OrderDataSource } from "../../../domain/datasources/orders/order.datasource";
import { Order, OrderStatus } from "../../../domain/entities/orders/order.entity";
import { PaginatedOrders } from "../../../domain/entities/orders/paginatedOrders.entity";
import { OrderRepository } from "../../../domain/repository/orders/order.repository";

export class OrderRepositoryImpl implements OrderRepository {
  constructor(private readonly orderDataSource: OrderDataSource) {}

  createOrder(order: Order): Promise<Order> {
    return this.orderDataSource.createOrder(order);
  }

  updateOrderStatus(
    externalReference: string,
    status: OrderStatus,
    mercadoPagoPaymentId?: string,
    paidAt?: Date
  ): Promise<Order> {
    return this.orderDataSource.updateOrderStatus(
      externalReference,
      status,
      mercadoPagoPaymentId,
      paidAt
    );
  }

  updateOrderPreferenceId(orderId: number, preferenceId: string): Promise<Order> {
    return this.orderDataSource.updateOrderPreferenceId(orderId, preferenceId);
  }

  findByExternalReference(reference: string): Promise<Order | null> {
    return this.orderDataSource.findByExternalReference(reference);
  }

  findById(id: number): Promise<Order | null> {
    return this.orderDataSource.findById(id);
  }

  findByUserId(userId: string): Promise<Order[] | null> {
    return this.orderDataSource.findByUserId(userId);
  }

  findAllPaginated(page: number, limit: number): Promise<PaginatedOrders> {
    return this.orderDataSource.findAllPaginated(page, limit);
  }

  findByUserIdPaginated(userId: string, page: number, limit: number): Promise<PaginatedOrders> {
    return this.orderDataSource.findByUserIdPaginated(userId, page, limit);
  }
}