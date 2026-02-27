// src/application/dtos/orders/paginatedOrders.response.dto.ts
import { PaginatedOrders } from "../../../domain/entities/orders/paginatedOrders.entity";
import { Order } from "../../../domain/entities/orders/order.entity";

export class PaginatedOrdersResponseDTO {
  orders: Order[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalOrders: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };

  constructor(paginatedOrders: PaginatedOrders) {
    this.orders = paginatedOrders.orders;
    this.pagination = paginatedOrders.pagination;
  }
}