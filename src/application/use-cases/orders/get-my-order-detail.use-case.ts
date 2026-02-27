// src/application/use-cases/orders/get-my-order-detail.use-case.ts
import { Order } from "../../../domain/entities/orders/order.entity";
import { OrderRepository } from "../../../domain/repository/orders/order.repository";

interface GetMyOrderDetailCase {
  execute: (externalReference: string, userId: string) => Promise<Order | null>;
}

export class GetMyOrderDetailUseCase implements GetMyOrderDetailCase {
  constructor(
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(externalReference: string, userId: string): Promise<Order | null> {
    // if (!orderId || orderId < 1) {
    //   throw new Error("Order ID must be a valid positive number");
    // }
    
    if (!userId) {
      throw new Error("User ID is required");
    }
    
    const order = await this.orderRepository.findByExternalReference(externalReference)
    
    // Verificar que la orden pertenece al usuario
    if (order && order.userId !== userId) {
      throw new Error("You don't have permission to view this order");
    }
    
    return order;
  }
}