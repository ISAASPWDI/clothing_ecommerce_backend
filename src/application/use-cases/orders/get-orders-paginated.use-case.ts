// src/application/use-cases/orders/get-orders-paginated.use-case.ts
import { PaginatedOrders } from "../../../domain/entities/orders/paginatedOrders.entity";
import { OrderRepository } from "../../../domain/repository/orders/order.repository";

interface GetOrdersPaginatedCase {
  execute: (page: number, limit: number) => Promise<PaginatedOrders>;
}

export class GetOrdersPaginatedUseCase implements GetOrdersPaginatedCase {
  constructor(
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(page: number = 1, limit: number = 10): Promise<PaginatedOrders> {
    if (page < 1) throw new Error("Page must be greater than 0");
    if (limit < 1 || limit > 100) throw new Error("Limit must be between 1 and 100");
    
    return this.orderRepository.findAllPaginated(page, limit);
  }
}