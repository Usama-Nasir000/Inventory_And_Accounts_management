
// import { InputCustomer } from "../../models/Customer"
// import { QueryConfig } from "../types/query-config"
const { db } = require("../../db/index")

const resolvers = {
  Query: {
    getCustomer: async (_, { id }) => {
      try {
        const query = {
          text: `
              SELECT
              c.id,
              c.name,
              c.first_name,
              c.middle_name,
              c.last_name,
              c.category,
              c.phone,
              c.work_phone,
              c.type,
              c.email,
              cd.currency,
              cd.terms,
              cd.amount,
              ca.billing_address,
              ca.billing_city,
              ca.billing_zip,
              ca.billing_state,
              ca.billing_country,
              ca.shipping_address,
              ca.shipping_city,
              ca.shipping_zip,
              ca.shipping_state,
              ca.shipping_country,
              ccp.contact_first_name,
              ccp.contact_last_name,
              ccp.contact_email,
              ccp.contact_phone,
              ccp.contact_job_role
              FROM customers AS c
              INNER JOIN customer_details AS cd ON c.id = cd.customer_id
              INNER JOIN customer_address AS ca ON c.id = ca.customer_id
              INNER JOIN customer_contact_person AS ccp ON c.id = ccp.customer_id
              WHERE c.id = $1;
      
          `,
          values: [id],
        };

        const result = await db.query(query.text, query.values);

        if (result.rowCount > 0) {
          const response = {
            code: 200,
            status: 'success',
            data: result.rows[0],
          };
          return response;
        } else {
          const response = {
            code: 404,
            status: 'notfound',
            data: null
          };
          return response;
        }
      } catch (error) {

        const response = {
          code: 500,
          status: 'error',
          data: null
        };
        return response;
      }
    },




    getCustomers: async () => {
      try {
        const query = {
          text: `
            SELECT
            c.id,
            c.name,
            c.first_name,
            c.middle_name,
            c.last_name,
            c.category,
            c.phone,
            c.work_phone,
            c.type,
            c.email,
            cd.currency,
            cd.terms,
            cd.amount,
            ca.billing_address,
            ca.billing_city,
            ca.billing_zip,
            ca.billing_state,
            ca.billing_country,
            ca.shipping_address,
            ca.shipping_city,
            ca.shipping_zip,
            ca.shipping_state,
            ca.shipping_country,
            ccp.contact_first_name,
            ccp.contact_last_name,
            ccp.contact_email,
            ccp.contact_phone,
            ccp.contact_job_role
          FROM customers AS c
          INNER JOIN customer_details AS cd ON c.id = cd.customer_id
          INNER JOIN customer_address AS ca ON c.id = ca.customer_id
          INNER JOIN customer_contact_person AS ccp ON c.id = ccp.customer_id;
          `,
        };

        const result = await db.query(query.text);

        if (result.rowCount > 0) {
          const response = {
            code: 200,
            status: 'success',
            count: result.rowCount,
            data: result.rows,
          };

          return response;
        } else {
          const response = {
            code: 404,
            status: 'notfound',
            count: 0,
            data: null,
          };

          return response;
        }
      } catch (error) {


        const response = {
          code: 500,
          status: 'error',
          count: 0,
          data: null
        };

        return response;
      }
    },



  },
  Mutation: {

    saveCustomer: async (_, content) => {
      const client = await db.connect();

      try {
        // Begin a transaction
        await client.query('BEGIN');

        // SAVING CUSTOMER
        const saveCustomerQuery = {
          text: `INSERT INTO customers (name, first_name, middle_name, last_name, type, category, email, work_phone, phone ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
          values: [content.name, content.first_name, content.middle_name, content.last_name, content.type, content.category, content.email, content.work_phone, content.phone],
        };

        const customerResult = await client.query(saveCustomerQuery.text,
          saveCustomerQuery.values);

        if (customerResult.rowCount !== 1) {
          throw new Error('Failed to insert customer');
        }

        const customerId = customerResult.rows[0].id;

        // SAVING CUSTOMER DETAILS
        const saveCustomerDetailsQuery = {
          text: `INSERT INTO customer_details (currency, terms, amount, customer_id) VALUES ($1, $2, $3, $4) RETURNING *`,
          values: [content.currency, content.terms, content.amount, customerId],
        };

        const customerDetailsResult = await client.query(saveCustomerDetailsQuery.text, saveCustomerDetailsQuery.values);

        if (customerDetailsResult.rowCount !== 1) {
          throw new Error('Failed to insert customer details');
        }

        // SAVING CUSTOMER ADDRESS
        const saveCustomerAddressQuery = {
          text: `INSERT INTO customer_address (billing_address, billing_city, billing_zip, billing_state, billing_country, shipping_address, shipping_city, shipping_zip, shipping_state, shipping_country, customer_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
          values: [content.billing_address, content.billing_city, content.billing_zip, content.billing_state, content.billing_country, content.billing_address, content.billing_city, content.billing_zip, content.billing_state, content.billing_country, customerId],
        };

        const customerAddressResult = await client.query(saveCustomerAddressQuery.text, saveCustomerAddressQuery.values);

        if (customerAddressResult.rowCount !== 1) {
          throw new Error('Failed to insert customer address');
        }

        // SAVING CUSTOMER CONTACT PERSON
        const saveCustomerContactPersonQuery = {
          text: `INSERT INTO customer_contact_person (contact_first_name, contact_last_name, contact_email, contact_phone, contact_job_role, customer_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
          values: [content.contact_first_name, content.contact_last_name, content.contact_email, content.contact_phone, content.contact_job_role, customerId],
        };

        const customerContactPersonResult = await client.query(saveCustomerContactPersonQuery.text, saveCustomerContactPersonQuery.values);

        if (customerContactPersonResult.rowCount !== 1) {
          throw new Error('Failed to insert customer contact person');
        }

        // Commit the transaction if all operations are successful
        await client.query('COMMIT');


        const response = {
          status: 'success',
          id: customerId,

          ...customerResult.rows[0],
          ...customerDetailsResult.rows[0],
          ...customerAddressResult.rows[0],
          ...customerContactPersonResult.rows[0],

        };

        return response;
      } catch (error) {

        await client.query('ROLLBACK');
        throw error;
      } finally {

        client.release();
      }
    },





  },
};

module.exports = resolvers;
