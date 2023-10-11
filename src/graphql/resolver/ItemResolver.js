
// // import { InputCustomer } from "../../models/Customer"
// // import { QueryConfig } from "../types/query-config"
const { db } = require("../../db/index")

const resolvers = {
  Query: {



    getItem: async (_, { id }) => {
      try {
        const query = {
          text: `
                     SELECT * FROM item WHERE id = $1 
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
            data: null,
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



    getItems: async () => {
      try {
        const query = {
          text: `
                    SELECT * FROM item  
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
            code: 200,
            status: 'notfound',
            count: 0,
            data: null
          };

          return response;
        }
      } catch (error) {



        const response = {
          code: 500,
          status: 'error',
          count: 0,
          data: null,
        };

        return response;
      }
    },




  },
  Mutation: {



    saveItem: async (_, content) => {
      const client = await db.connect();
      try {
        // Begin a transaction
        await client.query('BEGIN');

        // SAVING CUSTOMER
        const saveItemQuery = {
          text: `INSERT INTO item (
                      name, code, price, category, status, cogs_account,
                      inventory_account, income_account, selected_costing_option,
                      selected_vendor, drop_shipping, purchase_description,
                      selected_locations, sales_description, sales_price,
                      price_level_name, qty_1, price_1, qty_2, price_2,
                      qty_3, price_3, qty_4, price_4, qty_5, price_5
                  ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
                      $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
                      $21, $22, $23, $24, $25, $26) RETURNING *`,
          values: [
            content.name,
            content.code,
            content.price,
            content.category,
            content.status,
            content.cogs_account,
            content.inventory_account,
            content.income_account,
            content.selected_costing_option,
            content.selected_vendor,
            content.drop_shipping,
            content.purchase_description,
            content.selected_locations,
            content.sales_description,
            content.sales_price,
            content.price_level_name,
            content.qty_1,
            content.price_1,
            content.qty_2,
            content.price_2,
            content.qty_3,
            content.price_3,
            content.qty_4,
            content.price_4,
            content.qty_5,
            content.price_5,
          ],
        };

        const customerResult = await client.query(saveItemQuery.text, saveItemQuery.values);

        if (customerResult.rowCount !== 1) {
          throw new Error('Failed to insert customer');
          
        }


        // Commit the transaction if all operations are successful
        await client.query('COMMIT');


        const response = {
          status: 'success',
          code:200,

          ...customerResult.rows[0],




        };

        return response;
      } catch (error) {


        await client.query('ROLLBACK');
        throw error;

      } finally {
        // Release the client back to the pool
        client.release();
      }
    },



  },
};

module.exports = resolvers;
