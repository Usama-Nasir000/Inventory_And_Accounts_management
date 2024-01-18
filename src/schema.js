const customerResolver = require('./graphql/resolver/CustomerResolver');
const vendorResolver = require('./graphql/resolver/VendorResolver');
const sales_orderResolver = require('./graphql/resolver/sales_order');
const purchase_orderResolver = require('./graphql/resolver/purchase_order');

const resolver = {
  Query: {
    // ...itemResolver.Query,
    ...customerResolver.Query,
    ...vendorResolver.Query,
    ...sales_orderResolver.Query,
    ...purchase_orderResolver.Query,
  },
  Mutation: {
    // ...itemResolver.Mutation,
    ...customerResolver.Mutation,
    ...vendorResolver.Mutation,
    ...sales_orderResolver.Mutation,
    ...purchase_orderResolver.Mutation,
  },
};
module.exports = resolver;