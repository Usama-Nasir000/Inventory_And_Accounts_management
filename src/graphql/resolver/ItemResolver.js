const { db } = require("../../db/index");

const resolvers = {
  Query: {



    getItem: async (_, { id }) => {
      try {
        const query = {
          text: `
                     SELECT * FROM item WHERE itemid = $1 
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
      let response;
      let itemResult;
      try {
        // Begin a transaction
        await client.query('BEGIN');

        // SAVING CUSTOMER
        const saveItemQuery = {
          text: `
          INSERT INTO item (
            userid,
            itemid,
            item_image,
            item_name,
            item_code, 
            category, 
            status, 
            purchase_price, 
            sales_price, 
            stock_quantity,
            income_account, 
            cogs_account, 
            inventory_account,
            currency
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
                 )
             RETURNING *;
             `
             ,
          values: [
            content.userid,
            content.itemid,
            content.item_image,
            content.item_name,
            content.item_code,
            content.category,
            content.status,
            content.purchase_price,
            content.sales_price,
            content.stock_quantity,
            content.income_account,
            content.cogs_account,
            content.inventory_account,
            content.currency,
          ],
        };

         itemResult = await client.query(saveItemQuery.text, saveItemQuery.values);

        if (itemResult.rowCount !== 1) {
          throw new Error('Failed to insert customer');

        };

        response = {
          status: 'success',
          code: 200,
          id:content.itemid,
          ItemResult:itemResult.rows[0],
        };


        // Commit the transaction if all operations are successful
        await client.query('COMMIT');
        console.log("Transaction Successful")
        return response;
      } catch (error) {
        console.log(error);
        await client.query('ROLLBACK');
        response = {
          code: 500,
          status: 'error',
          data: null,
          error: error.message,
        };
        return response;
      } finally {
        // Release the client back to the pool
        client.release();
      }
    },
  },
};

module.exports = resolvers;
