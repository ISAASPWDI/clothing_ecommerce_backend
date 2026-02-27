import { PaymentMethod } from "../payment_methods/paymentMethod.entity";
import { CustomerInfo } from "./customerInfo.entity";
import { OrderItem } from "./orderItem.entity";

export enum OrderStatus {
  Procesando = "Procesando",
  Enviado = "Enviado",
  Entregado = "Entregado",
  PENDING = "PENDING",
  PAID = "PAID",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
}

export class Order {
  id?: number;
  externalReference?: string;
  userId: string;
  paymentMethodId: number;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  paymentMethod?: PaymentMethod; 
  customerInfo?: CustomerInfo;
  mercadoPagoPaymentId?: string;
  mercadoPagoPreferenceId?: string;
  createdAt?: Date;
  paidAt?: Date;

  constructor(props: Order) {

    if (!props.userId) throw new Error("Order: userId is required");
    if (!props.paymentMethodId) throw new Error("Order: paymentMethodId is required");
    if (!props.status) throw new Error("Order: status is required");
    if (props.total === undefined) throw new Error("Order: total is required");
    if (!props.items || props.items.length === 0) throw new Error("Order: items is required");
    
    this.id = props.id;
    this.externalReference = props.externalReference;
    this.userId = props.userId;
    this.paymentMethodId = props.paymentMethodId;
    this.paymentMethod = props.paymentMethod;
    this.status = props.status;
    this.total = props.total;
    this.items = props.items;
    this.customerInfo = props.customerInfo;
    this.mercadoPagoPaymentId = props.mercadoPagoPaymentId;
    this.mercadoPagoPreferenceId = props.mercadoPagoPreferenceId;
    this.createdAt = props.createdAt;
    this.paidAt = props.paidAt;
  }
}