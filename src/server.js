const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');
const cors = require('cors');
const routes = require('./item/routes')
const resolvers = require('./schema')
const typeDefs = require('./graphql/schema/schema');
const bodyParser = require('body-parser');
const path = require('path');

const server = new ApolloServer({typeDefs,
  resolvers,
  plugins:[
    ApolloServerPluginLandingPageGraphQLPlayground(),
  ],
});
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use('/item',routes);
// express.static(path.join(__dirname, './images'))
app.use('/images', express.static(path.join(__dirname, './images')));

// const router = express.Router()


async function startServer(){
  await server.start();
  server.applyMiddleware({app});
}

startServer().then( async ()=>{
   
  const PORT = 4000;
  // const IP_ADDRESS = '0.0.0.0';
  const IP_ADDRESS = 'localhost';
  app.listen(PORT, IP_ADDRESS, () => {
    console.log(`Server running at http://${IP_ADDRESS}:${PORT}`);
    console.log(`GraphQL playground at http://${IP_ADDRESS}:${PORT}${server.graphqlPath}`);
  });
});
