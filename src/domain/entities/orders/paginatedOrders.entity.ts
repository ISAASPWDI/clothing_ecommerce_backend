// src/domain/entities/orders/paginatedOrders.entity.ts
import { Order } from "./order.entity";

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export class PaginatedOrders {
  orders: Order[];
  pagination: PaginationInfo;

  constructor(props: PaginatedOrders) {
    if (!props.orders) throw new Error("PaginatedOrders: orders is required");
    if (!props.pagination) throw new Error("PaginatedOrders: pagination is required");
    
    this.orders = props.orders;
    this.pagination = props.pagination;
  }
}