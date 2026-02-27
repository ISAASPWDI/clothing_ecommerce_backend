import { OrderStatus } from "../../../domain/entities/orders/order.entity";
import { OrderRepository } from "../../../domain/repository/orders/order.repository";

interface UpdateOrderStatusCase {
  execute: (
    externalReference: string,
    status: OrderStatus,
    mercadoPagoPaymentId?: string
  ) => Promise<void>;
}

export class UpdateOrderStatusUseCase implements UpdateOrderStatusCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(
    externalReference: string,
    status: OrderStatus,
    mercadoPagoPaymentId?: string
  ): Promise<void> {
    const order = await this.orderRepository.findByExternalReference(externalReference);

    if (!order) {
      throw new Error(`Orden no encontrada: ${externalReference}`);
    }

    if (order.status === OrderStatus.PAID) {
      console.log('⚠️ Orden ya estaba pagada:', order.id);
      return; 
    }

    const paidAt = status === OrderStatus.PAID ? new Date() : undefined;

    await this.orderRepository.updateOrderStatus(
      externalReference,
      status,
      mercadoPagoPaymentId,
      paidAt
    );

    console.log(`✅ Orden actualizada a ${status}:`, order.id);
  }
}