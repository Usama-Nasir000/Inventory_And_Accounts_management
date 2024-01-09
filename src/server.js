const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');
const cors = require('cors');
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

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });

  await server.start();  // Make sure to await server.start()

  const app = express();

  app.use(cors());

  const PORT = 4000;
  const IP_ADDRESS = '192.168.4.119';

  server.applyMiddleware({ app });

  app.use(cors());


  app.listen(PORT, IP_ADDRESS, () => {
    console.log(`Server running at http://${IP_ADDRESS}:${PORT}`);
  });
}

startApolloServer().catch((error) => {
  console.error('Error starting the server:', error);
});









// const fs = require('fs');
// const https = require('https');
// const { ApolloServer } = require('apollo-server-express');
// const express = require('express');
// const typeDefs = require('./graphql/schema/schema');

// const itemResolver = require('./graphql/resolver/ItemResolver');
// const customerResolver = require('./graphql/resolver/CustomerResolver');
// const vendorResolver = require('./graphql/resolver/VendorResolver');
// const sales_orderResolver = require('./graphql/resolver/sales_order');
// const purchase_orderResolver = require('./graphql/resolver/purchase_order');

// const resolvers = { 
//   Query: {
//     ...itemResolver.Query,
//     ...customerResolver.Query,
//     ...vendorResolver.Query,
//     ...sales_orderResolver.Query,
//     ...purchase_orderResolver.Query,
//   },
//   Mutation: {
//     ...itemResolver.Mutation,
//     ...customerResolver.Mutation,
//     ...vendorResolver.Mutation,
//     ...sales_orderResolver.Mutation,
//     ...purchase_orderResolver.Mutation,
//   },
// };

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
// });

// const app = express();

// const httpsOptions = {
//   key: fs.readFileSync('path/to/private-key.pem'),
//   cert: fs.readFileSync('path/to/certificate.pem'),
// };


// const PORT = 4000;
// https.createServer(httpsOptions, app).listen(PORT, () => {
//   console.log(`Server running at https://0.0.0.0:${PORT}/graphql`);
// });

// // Start the Apollo Server before applying middleware
// async function startServer() {
//   await server.start();
//   server.applyMiddleware({ app });
  
//   const PORT = 4000;

//   app.listen(PORT, () => {
//     console.log(`Server running at http://0.0.0.0:${PORT}/graphql`);
//   });
// }

// startServer();