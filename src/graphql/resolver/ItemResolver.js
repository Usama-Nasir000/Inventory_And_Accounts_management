// const {GraphQLUpload} = require ('graphql-upload');
const { createWriteStream } = require('fs');
const { db } = require("../../db/index");
// const { path } = require('../../images/')

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
    saveItem: async (_, { image, ...content }) => {
      const client = await db.connect();
      let response;
      let itemResult;
      try {
        // Begin a transaction
        await client.query('BEGIN');


        const { createReadStream } = await content.image;
        const stream = createReadStream();
        const path = '../../images/'
        // Generate a unique filename based on the current timestamp
        const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
        const newFilename = `${timestamp}.jpg`; // Adjust the extension as needed

        // Specify the full path for the new filename
        const fullPath = path + newFilename;

        await new Promise((resolve, reject) =>
          stream
            .pipe(createWriteStream(fullPath))
            .on('finish', () => {
              // Resolve with the new filename when the operation is complete
              resolve(newFilename);
            })
            .on('error', (error) => {
              // Reject with the error if there's an issue during the operation
              reject(error);
            })
        );

        content.item_image = path;

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
          id: content.itemid,
          ItemResult: itemResult.rows[0],
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
