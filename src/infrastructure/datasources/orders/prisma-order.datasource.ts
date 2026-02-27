import { OrderDataSource } from "../../../domain/datasources/orders/order.datasource";
import { CustomerInfo } from "../../../domain/entities/orders/customerInfo.entity";
import { Order, OrderStatus } from "../../../domain/entities/orders/order.entity";
import { OrderItem } from "../../../domain/entities/orders/orderItem.entity";
import { PaginatedOrders } from "../../../domain/entities/orders/paginatedOrders.entity";
import { prisma } from "../../database/prisma";



export class PrismaOrderDataSource implements OrderDataSource {

  async createOrder(order: Order): Promise<Order> {

    if (!order.status) {
      throw new Error("Order status is required");
    }
    if (order.total === undefined) {
      throw new Error("Order total is required");
    }
    if (!order.items || order.items.length === 0) {
      throw new Error("Order must have at least one item");
    }


    if (order.customerInfo) {

      const createdCustomerInfo = await prisma.customerInfo.create({
        data: {
          firstName: order.customerInfo.firstName,
          lastName: order.customerInfo.lastName,
          email: order.customerInfo.email,
          phone: order.customerInfo.phone,
          address: order.customerInfo.address,
          apartment: order.customerInfo.apartment || null,
          city: order.customerInfo.city || null,
          province: order.customerInfo.province || null,
          zipCode: order.customerInfo.zipCode,
        }
      });


      const createdOrder = await prisma.order.create({
        data: {
          externalReference: order.externalReference || null,
          userId: order.userId,
          paymentMethodId: order.paymentMethodId,
          status: order.status,
          total: order.total,
          customerInfoId: createdCustomerInfo.id,
          orderItems: {
            create: order.items.map(item => ({
              productId: item.productId,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              selectedColor: item.selectedColor || null,
              selectedSize: item.selectedSize || null,
            }))
          }
        },
        include: {
          orderItems: true,
          customerInfo: true,
          paymentMethod: true,
          user: true
        }
      });

      return this.mapToEntity(createdOrder);
    } else {

      const createdOrder = await prisma.order.create({
        data: {
          externalReference: order.externalReference || null,
          userId: order.userId,
          paymentMethodId: order.paymentMethodId,
          status: order.status,
          total: order.total,
          orderItems: {
            create: order.items.map(item => ({
              productId: item.productId,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              selectedColor: item.selectedColor || null,
              selectedSize: item.selectedSize || null,
            }))
          }
        },
        include: {
          orderItems: true,
          customerInfo: true,
          paymentMethod: true,
          user: true
        }
      });

      return this.mapToEntity(createdOrder);
    }
  }

  async updateOrderStatus(
    externalReference: string,
    status: OrderStatus,
    mercadoPagoPaymentId?: string,
    paidAt?: Date
  ): Promise<Order> {
    const updatedOrder = await prisma.order.update({
      where: { externalReference },
      data: {
        status,
        mercadoPagoPaymentId: mercadoPagoPaymentId || null,
        paidAt: paidAt || null
      },
      include: {
        orderItems: true,
        customerInfo: true,
        paymentMethod: true,
        user: true
      }
    });

    return this.mapToEntity(updatedOrder);
  }

  async updateOrderPreferenceId(orderId: number, preferenceId: string): Promise<Order> {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { mercadoPagoPreferenceId: preferenceId },
      include: {
        orderItems: true,
        customerInfo: true,
        paymentMethod: true,
        user: true
      }
    });

    return this.mapToEntity(updatedOrder);
  }

  async findByExternalReference(reference: string): Promise<Order | null> {
    const order = await prisma.order.findFirst({
      where: { externalReference: reference },
      include: {
        orderItems: true,
        customerInfo: true,
        paymentMethod: true,
        user: true
      }
    });

    if (!order) return null;
    console.log("PRISMA ORDER PAYMENT METHOD:", order.paymentMethod);

    return this.mapToEntity(order);
  }

  async findById(id: number): Promise<Order | null> {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: true,
        customerInfo: true,
        paymentMethod: true,
        user: true
      }
    });

    if (!order) return null;
    return this.mapToEntity(order);
  }

  async findByUserId(userId: string): Promise<Order[] | null> {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: true,
        customerInfo: true,
        paymentMethod: true,
        user: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return orders.map(order => this.mapToEntity(order));
  }

  private mapToEntity(prismaOrder: any): Order {
    console.log("ENTITY PAYMENT METHOD:", prismaOrder.paymentMethod);


    return new Order({
      id: prismaOrder.id,
      externalReference: prismaOrder.externalReference || undefined,
      userId: prismaOrder.userId,
      paymentMethodId: prismaOrder.paymentMethodId,
      status: prismaOrder.status as OrderStatus,
      total: Number(prismaOrder.total),
      items: prismaOrder.orderItems.map((item: any) => new OrderItem({
        id: item.id,
        orderId: item.orderId,
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: Number(item.price),
        selectedColor: item.selectedColor || undefined,
        selectedSize: item.selectedSize || undefined,
      })),
      paymentMethod: prismaOrder.paymentMethod
        ? {
          id: prismaOrder.paymentMethod.id,
          name: prismaOrder.paymentMethod.name,
          description: prismaOrder.paymentMethod.description,
          code: prismaOrder.paymentMethod.code,
          settings: prismaOrder.paymentMethod.settings,

        }
        : undefined,

      customerInfo: prismaOrder.customerInfo ? new CustomerInfo({
        id: prismaOrder.customerInfo.id,
        firstName: prismaOrder.customerInfo.firstName,
        lastName: prismaOrder.customerInfo.lastName,
        email: prismaOrder.customerInfo.email,
        phone: prismaOrder.customerInfo.phone,
        address: prismaOrder.customerInfo.address,
        apartment: prismaOrder.customerInfo.apartment || undefined,
        city: prismaOrder.customerInfo.city || undefined,
        province: prismaOrder.customerInfo.province || undefined,
        zipCode: prismaOrder.customerInfo.zipCode,
      }) : undefined,
      mercadoPagoPaymentId: prismaOrder.mercadoPagoPaymentId || undefined,
      mercadoPagoPreferenceId: prismaOrder.mercadoPagoPreferenceId || undefined,
      createdAt: prismaOrder.createdAt,
      paidAt: prismaOrder.paidAt || undefined,
    });
  }
  async findAllPaginated(page: number = 1, limit: number = 10): Promise<PaginatedOrders> {
    const skip = (page - 1) * limit;

    const [orders, totalOrders] = await Promise.all([
      prisma.order.findMany({
        skip,
        take: limit,
        include: {
          orderItems: true,
          customerInfo: true,
          paymentMethod: true,
          user: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.order.count()
    ]);

    const totalPages = Math.ceil(totalOrders / limit);

    return new PaginatedOrders({
      orders: orders.map(order => this.mapToEntity(order)),
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  }

  async findByUserIdPaginated(userId: string, page: number = 1, limit: number = 10): Promise<PaginatedOrders> {
    const skip = (page - 1) * limit;

    const [orders, totalOrders] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          orderItems: true,
          customerInfo: true,
          paymentMethod: true,
          user: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.order.count({ where: { userId } })
    ]);

    const totalPages = Math.ceil(totalOrders / limit);

    return new PaginatedOrders({
      orders: orders.map(order => this.mapToEntity(order)),
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  }
}