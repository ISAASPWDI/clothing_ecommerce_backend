// ApiWithGraphQL.ts
import { ApolloServer } from '@apollo/server';
import express, { Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import { json } from 'body-parser';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';
import { createContext, GraphQLContext } from './graphql/context';
import { UpdateOrderStatusUseCase } from '../application/use-cases/orders/updateOrderStatus.usecase';
import { MercadoPagoService } from '../infrastructure/services/mercadoPago.service';
import { OrderRepositoryImpl } from '../infrastructure/repository/orders/orderRepository.impl';
import { PrismaOrderDataSource } from '../infrastructure/datasources/orders/prisma-order.datasource';
import { OrderStatus } from '../domain/entities/orders/order.entity';

const orderDataSource = new PrismaOrderDataSource();
const orderRepository = new OrderRepositoryImpl(orderDataSource);
const updateOrderStatusUseCase = new UpdateOrderStatusUseCase(orderRepository);

export class ApiWithGraphQL {
  private app: express.Application;
  private apolloServer: ApolloServer;
  private httpServer: http.Server;

  constructor() {
    this.app = express();
    this.httpServer = http.createServer(this.app);

    this.apolloServer = new ApolloServer<GraphQLContext>({
      typeDefs,
      resolvers,
      introspection: true,
      includeStacktraceInErrorResponses: process.env.NODE_ENV !== 'production',
    });
  }
  private setupPaymentRedirect(): void {
  this.app.get('/api/payment-redirect', async (req: Request, res: Response) => {
    try {
      const { 
        status, 
        external_reference, 
        collection_id, 
        payment_id,
        collection_status,
        payment_type,
        merchant_order_id,
        preference_id
      } = req.query;

      console.log('🔄 Redirección de pago recibida:', { 
        status, 
        external_reference, 
        payment_id,
        collection_status 
      });

      // ✅ Mapear el status de MercadoPago a tus rutas de Next.js
      let redirectPath = '/checkout/error'; // Default
      
      if (status === 'approved' || collection_status === 'approved') {
        redirectPath = '/checkout/success';
      } else if (status === 'pending' || collection_status === 'pending') {
        redirectPath = '/checkout/pending';
      } else if (status === 'failure' || status === 'rejected' || collection_status === 'rejected') {
        redirectPath = '/checkout/failure';
      } else {
        redirectPath = '/checkout/failure';
      }

      // Construir URL del frontend
      const frontendUrl = new URL(
        redirectPath,
        process.env.FRONTEND_URL || 'http://localhost:3000'
      );
      
      // Agregar parámetros a la URL
      if (external_reference) {
        frontendUrl.searchParams.set('external_reference', external_reference as string);
      }
      if (payment_id) {
        frontendUrl.searchParams.set('payment_id', payment_id as string);
      }
      if (collection_status) {
        frontendUrl.searchParams.set('collection_status', collection_status as string);
      }
      if (merchant_order_id) {
        frontendUrl.searchParams.set('merchant_order_id', merchant_order_id as string);
      }

      console.log('➡️  Redirigiendo a:', frontendUrl.toString());

      res.redirect(frontendUrl.toString());
      
    } catch (error) {
      console.error('❌ Error en redirección de pago:', error);
      const errorUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${errorUrl}/checkout/error`);
    }
  });
}
  private setupMiddlewares(): void {

    this.app.use(cors({
      origin: '*', // En producción, especificar el dominio
      credentials: true,
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'apollo-require-preflight'],
    }));

    this.app.use(json());
  }

  private setupWebhooks(): void {
    // Webhook de MercadoPago
    this.app.post('/webhooks/mercadopago', async (req: Request, res: Response) => {
      try {
        const { type, data, action } = req.body;

        console.log('📬 Webhook MercadoPago recibido:', { type, action, data });

        if (type === 'payment' || action === 'payment.created' || action === 'payment.updated') {
          const paymentId = data?.id;

          if (!paymentId) {
            return res.status(400).json({ error: 'Payment ID no encontrado' });
          }

          const response = await fetch(
            `https://api.mercadopago.com/v1/payments/${paymentId}`,
            {
              headers: {
                'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`
              }
            }
          );

          if (!response.ok) {
            throw new Error(`Error consultando pago: ${response.statusText}`);
          }

          const payment = await response.json();

          console.log('💳 Estado del pago:', {
            id: payment.id,
            status: payment.status,
            externalReference: payment.external_reference
          });

          switch (payment.status) {
            case 'approved':
              await this.procesarPagoAprobado(payment);
              break;
            case 'rejected':
              await this.procesarPagoRechazado(payment);
              break;
            case 'pending':
              await this.procesarPagoPendiente(payment);
              break;
          }
        }

        res.status(200).json({ received: true });

      } catch (error) {
        console.error('❌ Error procesando webhook:', error);
        res.status(200).json({ error: 'Processed with errors' });
      }
    });

    // para probar en producción
    this.app.get('/health', (req: Request, res: Response) => {
      res.json({ status: 'ok', service: 'graphql-api' });
    });
  }

  private setupGraphQL(): void {
    // Endpoint de GraphQL
    this.app.post('/graphql', async (req: Request, res: Response) => {
      try {
        const { query, variables, operationName } = req.body;

        // ✅ Crear contexto usando tu función createContext
        const contextValue = await createContext(req);

        const result = await this.apolloServer.executeOperation(
          {
            query,
            variables,
            operationName,
          },
          {
            contextValue, // 👈 Context con autenticación
          }
        );

        // Manejar la respuesta según el formato de Apollo Server 5
        if ('body' in result && result.body.kind === 'single') {
          res.status(200).json(result.body.singleResult);
        } else {
          res.status(200).json(result);
        }
      } catch (error) {
        console.error('Error en GraphQL:', error);
        res.status(500).json({
          errors: [{
            message: 'Internal server error',
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
          }]
        });
      }
    });

    // Endpoint GET para Apollo Sandbox (introspection query)
    this.app.get('/graphql', async (req: Request, res: Response) => {
      // Apollo Sandbox envía la query como parámetro
      const query = req.query.query as string;

      if (!query) {
        return res.send(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>GraphQL API</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; }
                h1 { color: #333; }
                a { color: #3f20ba; text-decoration: none; }
                a:hover { text-decoration: underline; }
                .info { background: #f4f4f4; padding: 20px; border-radius: 5px; margin: 20px 0; }
              </style>
            </head>
            <body>
              <h1>🚀 GraphQL API está corriendo</h1>
              <div class="info">
                <p><strong>Endpoint:</strong> POST /graphql</p>
                <p><strong>Webhook MercadoPago:</strong> POST /webhooks/mercadopago</p>
              </div>
              <p>Usa <a href="https://studio.apollographql.com/sandbox/explorer?endpoint=http://localhost:${process.env.PORT || 4000}/graphql" target="_blank">Apollo Sandbox</a> para probar tus queries</p>
            </body>
          </html>
        `);
      }

      try {
        // Manejar introspection query de Apollo Sandbox
        const contextValue = await createContext(req);

        const result = await this.apolloServer.executeOperation(
          {
            query,
            variables: req.query.variables ? JSON.parse(req.query.variables as string) : undefined,
            operationName: req.query.operationName as string,
          },
          {
            contextValue,
          }
        );

        if ('body' in result && result.body.kind === 'single') {
          res.status(200).json(result.body.singleResult);
        } else {
          res.status(200).json(result);
        }
      } catch (error) {
        console.error('Error en GraphQL GET:', error);
        res.status(500).json({
          errors: [{ message: 'Internal server error' }]
        });
      }
    });
  }

  private async procesarPagoAprobado(payment: any): Promise<void> {
    console.log('✅ Procesando pago aprobado:', payment.id);

    const externalReference = payment.external_reference;

    if (!externalReference) {
      console.error('❌ No se encontró external_reference en el pago');
      return;
    }
    console.log('💳 Estado del pago:', {
      id: payment.id,
      status: payment.status,
      externalReference: payment.external_reference
    });


    try {
      await updateOrderStatusUseCase.execute(
        externalReference,
        OrderStatus.PAID,
        payment.id.toString()
      );
    } catch (error) {
      console.error('❌ Error actualizando orden:', error);
    }
  }

  private async procesarPagoRechazado(payment: any): Promise<void> {
    console.log('❌ Procesando pago rechazado:', payment.id);

    const externalReference = payment.external_reference;
    if (!externalReference) return;
    console.log('💳 Estado del pago:', {
      id: payment.id,
      status: payment.status,
      externalReference: payment.external_reference
    });
    try {
      await updateOrderStatusUseCase.execute(
        externalReference,
        OrderStatus.REJECTED,
        payment.id.toString()
      );
    } catch (error) {
      console.error('❌ Error actualizando orden rechazada:', error);
    }
  }

  private async procesarPagoPendiente(payment: any): Promise<void> {
    console.log('⏳ Procesando pago pendiente:', payment.id);

    const externalReference = payment.external_reference;
    if (!externalReference) return;
    console.log('💳 Estado del pago:', {
      id: payment.id,
      status: payment.status,
      externalReference: payment.external_reference
    });
    try {
      await updateOrderStatusUseCase.execute(
        externalReference,
        OrderStatus.PENDING,
        payment.id.toString()
      );
    } catch (error) {
      console.error('❌ Error actualizando orden pendiente:', error);
    }
  }

  public async createServer(): Promise<void> {
    // Inicializar Apollo Server
    await this.apolloServer.start();

    // Configurar middlewares
    this.setupMiddlewares();

    // Configurar webhooks
    this.setupWebhooks();

    this.setupPaymentRedirect();
    // Configurar GraphQL
    this.setupGraphQL();

    // Iniciar servidor
    const PORT = process.env.PORT || 4000;

    this.httpServer.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📊 GraphQL disponible en http://localhost:${PORT}/graphql`);
      console.log(`🔔 Webhook MercadoPago en http://localhost:${PORT}/webhooks/mercadopago`);
    });
  }
}

// index.ts o main.ts
const api = new ApiWithGraphQL();
api.createServer().catch(console.error);