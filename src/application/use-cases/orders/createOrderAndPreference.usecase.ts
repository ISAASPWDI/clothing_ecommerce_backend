// domain/usecases/orders/createOrderAndPreference.usecase.ts
import { CustomerInfo } from "../../../domain/entities/orders/customerInfo.entity";
import { Order, OrderStatus } from "../../../domain/entities/orders/order.entity";
import { OrderItem } from "../../../domain/entities/orders/orderItem.entity";
import { OrderRepository } from "../../../domain/repository/orders/order.repository";
import { MercadoPagoService } from "../../../infrastructure/services/mercadoPago.service";

export interface CreateOrderInput {
  items: {
    productId: number;
    name: string;
    quantity: number;
    price: number;
    selectedColor?: string;
    selectedSize?: string;
  }[];
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    apartment?: string;
    city?: string;
    province?: string;
    zipCode: string;
  };
  total: number;
  userId?: string;
  paymentMethodId: number;
}

export interface PreferenceResponse {
  id: string;
  initPoint: string;
  // sandboxInitPoint?: string;
  externalReference: string;
  backUrls: {
    success: string;
    failure: string;
    pending: string;
  };
  autoReturn?: string;
}

interface CreateOrderAndPreferenceCase {
  execute: (input: CreateOrderInput) => Promise<PreferenceResponse>;
}

export class CreateOrderAndPreferenceUseCase implements CreateOrderAndPreferenceCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly mercadoPagoService: MercadoPagoService
  ) { }

  async execute(input: CreateOrderInput): Promise<PreferenceResponse> {
    // 1. Generar external reference único
    const externalReference = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const userId = input.userId || 'guest';

    try {
      // 2. Crear instancias de las entities
      console.log("El body es ", input);

      const orderItems = input.items.map(item => new OrderItem({

        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
      }));
      console.log("Order Items : ", orderItems);

      const customerInfo = new CustomerInfo({
        firstName: input.customerInfo.firstName,
        lastName: input.customerInfo.lastName,
        email: input.customerInfo.email,
        phone: input.customerInfo.phone,
        address: input.customerInfo.address,
        apartment: input.customerInfo.apartment,
        city: input.customerInfo.city,
        province: input.customerInfo.province,
        zipCode: input.customerInfo.zipCode,
      });

      const order = new Order({
        externalReference,
        userId,
        paymentMethodId: input.paymentMethodId,
        status: OrderStatus.PENDING,
        total: input.total,
        items: orderItems,
        customerInfo: customerInfo,
      });

      // 3. Crear la orden en BD
      const createdOrder = await this.orderRepository.createOrder(order);
      console.log('✅ Orden creada en BD:', createdOrder.id, externalReference);

      // 4. Preparar datos para MercadoPago
      const backUrls = {
        success: `${process.env.BACKEND_URL}/api/payment-redirect`,
        failure: `${process.env.BACKEND_URL}/api/payment-redirect`,
        pending: `${process.env.BACKEND_URL}/api/payment-redirect`
      };



      // ✅ Convertir productId (number) a string para MercadoPago
      const mercadoPagoItems = input.items.map(item => ({
        id: item.productId.toString(), // ✅ Convertir a string

        title: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        currency_id: "ARS",
        description: `${item.selectedColor || ''} ${item.selectedSize || ''}`.trim() || undefined,
        category_id: 'retail'
      }));

      const payer = {
        name: input.customerInfo.firstName,
        surname: input.customerInfo.lastName,
        email: input.customerInfo.email,
        phone: {
          area_code: "54", 
          number: input.customerInfo.phone
        },

        address: {
          street_name: input.customerInfo.address,
          zip_code: input.customerInfo.zipCode
        },
        province: input.customerInfo.province 
      };

      // 5. Crear preferencia en MercadoPago
      console.log("📤 Creando preferencia en MercadoPago...");
      const preferencia = await this.mercadoPagoService.createPreference(
        mercadoPagoItems,
        payer,
        backUrls,
        externalReference
      );

      // 6. Actualizar la orden con el preference_id
      await this.orderRepository.updateOrderPreferenceId(
        createdOrder.id!,
        preferencia.id
      );

      console.log('✅ Preferencia creada:', preferencia.id);

      const response = {
        id: preferencia.id,
        initPoint: preferencia.init_point,
        // sandboxInitPoint: preferencia.sandbox_init_point,
        externalReference,
        backUrls: preferencia.back_urls,
        autoReturn: preferencia.auto_return,
      }
      console.log('Respuesta: ', response);

      // 7. Retornar respuesta
      return {
        id: preferencia.id,
        initPoint: preferencia.init_point,
        // sandboxInitPoint: preferencia.sandbox_init_point,
        externalReference,
        backUrls: preferencia.back_urls,
        autoReturn: preferencia.auto_return,
      };

    } catch (error) {
      console.error('❌ Error en createOrderAndPreference:', error);

      // Si falla MercadoPago, marcar la orden como cancelada
      if (error instanceof Error && error.message.includes('MercadoPago')) {
        try {
          await this.orderRepository.updateOrderStatus(
            externalReference,
            OrderStatus.CANCELLED
          );
        } catch (updateError) {
          console.error('❌ Error al cancelar orden:', updateError);
        }
      }

      throw error;
    }
  }
}