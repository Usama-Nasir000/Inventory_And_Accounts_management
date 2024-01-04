const { ApolloServer } = require('apollo-server');
const typeDefs = require('./graphql/schema/schema');


const itemResolver = require('./graphql/resolver/ItemResolver');
const customerResolver = require('./graphql/resolver/CustomerResolver');
const vendorResolver = require('./graphql/resolver/VendorResolver');
const sales_orderResolver = require('./graphql/resolver/sales_order');
const purchase_orderResolver = require('./graphql/resolver/purchase_order');


const resolvers = { 
  Query: {
    ...itemResolver.Query,
    ...customerResolver.Query,
    ...vendorResolver.Query,
    ...sales_orderResolver.Query,
    ...purchase_orderResolver.Query,
  },
  Mutation: {
    ...itemResolver.Mutation,
    ...customerResolver.Mutation,
    ...vendorResolver.Mutation,
    ...sales_orderResolver.Mutation,
    ...purchase_orderResolver.Mutation,
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
