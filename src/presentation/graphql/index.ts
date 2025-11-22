// graphql/index.ts
import { ApolloServer } from '@apollo/server';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';

export interface GraphQLContext {
  token?: string;
  user?: any;
}

export const graphqlServer = new ApolloServer<GraphQLContext>({
  typeDefs,
  resolvers,
});