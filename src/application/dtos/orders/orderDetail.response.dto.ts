// src/application/dtos/orders/orderDetail.response.dto.ts

import { Order } from "../../../domain/entities/orders/order.entity";
import { OrderItem } from "../../../domain/entities/orders/orderItem.entity";
import { CustomerInfo } from "../../../domain/entities/orders/customerInfo.entity";

export class OrderDetailResponseDTO {
  id: number;
  externalReference?: string;
  userId: string;
  status: string;
  total: number;

  orderItems: OrderItem[];
  customerInfo?: CustomerInfo;

  paymentMethodId: number;

  paymentMethod: {
    id: number;
    name: string;
    description?: string;
    code?: string;
    settings?: any;
  } | null;

  mercadoPagoPaymentId?: string;
  mercadoPagoPreferenceId?: string;

  createdAt: Date;
  paidAt?: Date;

  subtotal: number;
  itemsCount: number;

  constructor(order: Order) {
    this.id = order.id!;
    this.externalReference = order.externalReference;
    this.userId = order.userId;
    this.status = order.status;
    this.total = order.total;

    this.orderItems = order.items;
    this.customerInfo = order.customerInfo;

    this.paymentMethodId = order.paymentMethodId;


    this.paymentMethod = order.paymentMethod
      ? {
          id: order.paymentMethod.id,
          name: order.paymentMethod.name,
          description: order.paymentMethod.description,
          code: order.paymentMethod.code,
          settings: order.paymentMethod.settings,
        }
      : null;

    this.mercadoPagoPaymentId = order.mercadoPagoPaymentId;
    this.mercadoPagoPreferenceId = order.mercadoPagoPreferenceId;

    this.createdAt = order.createdAt!;
    this.paidAt = order.paidAt;

    this.subtotal = this.calculateSubtotal(order.items);
    this.itemsCount = this.calculateItemsCount(order.items);
  }

  private calculateSubtotal(items: OrderItem[]): number {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  private calculateItemsCount(items: OrderItem[]): number {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }
}
