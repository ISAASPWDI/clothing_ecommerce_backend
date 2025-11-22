// ApiWithGraphQL.ts
import { ApolloServer } from '@apollo/server';
import express, { Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import { json } from 'body-parser';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';
import { createContext, GraphQLContext } from './graphql/context';

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
    console.log('✅ Pago aprobado:', payment.id);
    // Tu lógica aquí
  }

  private async procesarPagoRechazado(payment: any): Promise<void> {
    console.log('❌ Pago rechazado:', payment.id);
  }

  private async procesarPagoPendiente(payment: any): Promise<void> {
    console.log('⏳ Pago pendiente:', payment.id);
  }

  public async createServer(): Promise<void> {
    // Inicializar Apollo Server
    await this.apolloServer.start();

    // Configurar middlewares
    this.setupMiddlewares();

    // Configurar webhooks
    this.setupWebhooks();

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