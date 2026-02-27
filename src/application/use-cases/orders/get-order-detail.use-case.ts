// src/application/use-cases/orders/get-order-detail.use-case.ts
import { Order } from "../../../domain/entities/orders/order.entity";
import { OrderRepository } from "../../../domain/repository/orders/order.repository";

interface GetOrderDetailCase {
  execute: (orderId: number) => Promise<Order | null>;
}

export class GetOrderDetailUseCase implements GetOrderDetailCase {
  constructor(
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(orderId: number): Promise<Order | null> {
    if (!orderId || orderId < 1) {
      throw new Error("Order ID must be a valid positive number");
    }
    
    return this.orderRepository.findById(orderId);
  }
}