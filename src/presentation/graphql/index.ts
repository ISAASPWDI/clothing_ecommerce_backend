import { ApolloServer } from 'apollo-server';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';
import { createContext } from './context';

export const graphqlServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: createContext,
});
