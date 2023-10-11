const { gql } = require('apollo-server');
const fs = require('fs');
const path = require('path');

// Define the paths to your .gql files
const customersSchemaPath = path.join(__dirname, 'customers.gql');
const vendorsSchemaPath = path.join(__dirname, 'vendors.gql');
const itemsSchemaPath = path.join(__dirname, 'items.gql');

// Read the contents of the .gql files
const customersTypeDefs = fs.readFileSync(customersSchemaPath, 'utf8');
const vendorsTypeDefs = fs.readFileSync(vendorsSchemaPath, 'utf8');
const itemsTypeDefs = fs.readFileSync(itemsSchemaPath, 'utf8');

// Combine the schemas
const TypeDefs = gql`
  ${customersTypeDefs}
  ${vendorsTypeDefs}
  ${itemsTypeDefs}
`;

module.exports = TypeDefs;
