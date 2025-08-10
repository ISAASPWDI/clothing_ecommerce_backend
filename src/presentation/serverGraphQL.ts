import { graphqlServer } from "./graphql";
export class ApiWithGraphQL {
  public static createServer(): void {

    graphqlServer.listen().then(({ url }) => {
      console.log(`Server ready at ${url}`);
    });
  }
}

