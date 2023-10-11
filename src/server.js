const { ApolloServer } = require('apollo-server');
const typeDefs = require('./graphql/schema/schema');


const itemResolver = require('./graphql/resolver/ItemResolver');
const customerResolver = require('./graphql/resolver/CustomerResolver');
const vendorResolver = require('./graphql/resolver/VendorResolver');


const resolvers = { 
  Query: {
    ...itemResolver.Query,
    ...customerResolver.Query,
    ...vendorResolver.Query,
  },
  Mutation: {
    ...itemResolver.Mutation,
    ...customerResolver.Mutation,
    ...vendorResolver.Mutation,
  },
};



const server = new ApolloServer({
  typeDefs,
  resolvers,
  // rootValue: db,
  // tracing: true

});

// server.listen({ host: '0.0.0.0', port: 4000 }).then(({ url }) => {
//   console.log(`Server running at ${url}`);
// });

server.listen().then(({ url }) => {
  console.log(`Server running at ${url}`);
});
