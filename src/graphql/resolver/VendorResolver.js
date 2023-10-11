
// // import { InputVendor } from "../../models/Vendor"
// // import { QueryConfig } from "../types/query-config"
// const { db } = require("../../db/index")

// const resolvers = {
//   Query: {


//     getVendor: async (_, { id }) => {
//       try {
//         const query = {
//           text: `
//             SELECT
//             c.id,
//             c.name,
//             c.first_name,
//             c.middle_name,
//             c.last_name,
//             c.category,
//             c.phone,
//             c.work_phone,
//             c.type,
//             c.email,
//             cd.currency,
//             cd.terms,
//             cd.amount,
//             ca.billing_address,
//             ca.billing_city,
//             ca.billing_zip,
//             ca.billing_state,
//             ca.billing_country,
//             ca.shipping_address,
//             ca.shipping_city,
//             ca.shipping_zip,
//             ca.shipping_state,
//             ca.shipping_country,
//             ccp.contact_first_name,
//             ccp.contact_last_name,
//             ccp.contact_email,
//             ccp.contact_phone,
//             ccp.contact_job_role
//             FROM vendors AS c
//             INNER JOIN vendor_details AS cd ON c.id = cd.vendor_id
//             INNER JOIN vendor_address AS ca ON c.id = ca.vendor_id
//             INNER JOIN vendor_contact_person AS ccp ON c.id = ccp.vendor_id
//             WHERE c.id = $1;
//           `,
//           values: [id],
//         };
    
//         const result = await db.query(query.text, query.values);
    
//         if (result.rowCount > 0) {
//           const response = {
//             code: 200,
//             status: 'success',
//             data: result.rows[0],
//           };
//           return response;
//         } else {
//           const response = {
//             code: 404, // Set an appropriate status code for not found
//             status: 'notfound',
//             data: null, // You can set data to null or an empty object if needed
//           };
//           return response;
//         }
//       } catch (error) {
        
//         const response = {
//           code: 500,
//           status: 'error',
//           data: null
//         };
//         return response;
//       }
//     },
    


//     getVendors: async () => {
//       try {
//         const query = {
//           text: `
//             SELECT
//             c.id,
//             c.name,
//             c.first_name,
//             c.middle_name,
//             c.last_name,
//             c.category,
//             c.phone,
//             c.work_phone,
//             c.type,
//             c.email,
//             cd.currency,
//             cd.terms,
//             cd.amount,
//             ca.billing_address,
//             ca.billing_city,
//             ca.billing_zip,
//             ca.billing_state,
//             ca.billing_country,
//             ca.shipping_address,
//             ca.shipping_city,
//             ca.shipping_zip,
//             ca.shipping_state,
//             ca.shipping_country,
//             ccp.contact_first_name,
//             ccp.contact_last_name,
//             ccp.contact_email,
//             ccp.contact_phone,
//             ccp.contact_job_role  
//           FROM vendors AS c
//           INNER JOIN vendor_details AS cd ON c.id = cd.vendor_id
//           INNER JOIN vendor_address AS ca ON c.id = ca.vendor_id
//           INNER JOIN vendor_contact_person AS ccp ON c.id = ccp.vendor_id;
//           `,
//         };
    
//         const result = await db.query(query.text);
//         if (result.rowCount > 0) {
//           const response = {
//             code: 200,
//             status: 'success',
//             count:result.rowCount,
//             data: result.rows,
//           };
    
//           return response;
//         } else {
//           const response = {
//             code: 404,
//             status: 'notfound',
//             count:0,
//             data: null
//           };
    
//           return response;
//         }
//       } catch (error) {

        
    
//         const response = {
//           code: 500,
//           status: 'error',
//           count:0,
//           data: null,
//         };
    
//         return response;
//       }
//     },
    


//   },

//   Mutation: {

//     saveVendor: async (_, content) => {
//       const client = await db.connect();

//       try {
//         await client.query('BEGIN');

//         // SAVING Vendor
//         const saveVendorQuery = {
//           text: `INSERT INTO vendors (name, first_name, middle_name, last_name, type, category, email, work_phone, phone ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
//           values: [content.name, content.first_name, content.middle_name, content.last_name, content.type, content.category, content.email, content.work_phone, content.phone],
//         };
//         console.log(content.name, content.first_name, content.middle_name, content.last_name, content.type, content.category, content.email, content.work_phone, content.phone)

//         const vendorResult = await client.query(saveVendorQuery.text, saveVendorQuery.values)
        

//         if (vendorResult.rowCount !== 1) {
//           throw new Error('Failed to insert vendor');
//         }

//         const vendorId = vendorResult.rows[0].id;

//         // SAVING Vendor DETAILS
//         const saveVendorDetailsQuery = {
//           text: `INSERT INTO vendor_details (currency, terms, amount, vendor_id) VALUES ($1, $2, $3, $4) RETURNING *`,
//           values: [content.currency, content.terms, content.amount, vendorId],
//         };
//         console.log(content.currency, content.terms, content.amount, vendorId)

//         const vendorDetailsResult = await client.query(saveVendorDetailsQuery.text, saveVendorDetailsQuery.values);

//         if (vendorDetailsResult.rowCount !== 1) {
//           throw new Error('Failed to insert vendor details');
//         }
//         // SAVING Vendor CONTACT PERSON
//         const saveVendorContactPersonQuery = {
//           text: `INSERT INTO vendor_contact_person (contact_first_name, contact_last_name, contact_email, contact_phone, contact_job_role, vendor_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
//           values: [content.contact_first_name, content.contact_last_name, content.contact_email, content.contact_phone, content.contact_job_role, vendorId],
//         };
//         console.log(content.contact_first_name, content.contact_last_name, content.contact_email, content.contact_phone, content.contact_job_role, vendorId)
  
        
  
//         const vendorContactPersonResult = await client.query(saveVendorContactPersonQuery.text, saveVendorContactPersonQuery.values);
        
//         if (vendorContactPersonResult.rowCount !== 1) {
//           throw new Error('Failed to insert vendor contact person');
//         }
        
        
//         // SAVING Vendor ADDRESSES (Array of Addresses)
//         const addresses = [];
        
//         for (const addressInput of content.addresses) {
//         const saveVendorAddressQuery = {
//           text: `INSERT INTO vendor_address (billing_address, billing_city, billing_zip, billing_state, billing_country, shipping_address, shipping_city, shipping_zip, shipping_state, shipping_country, vendor_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
//           values: [
//             addressInput.billing_address,
//             addressInput.billing_city,
//             addressInput.billing_zip,
//             addressInput.billing_state,
//             addressInput.billing_country,
//             addressInput.shipping_address,
//             addressInput.shipping_city,
//             addressInput.shipping_zip,
//             addressInput.shipping_state,
//             addressInput.shipping_country,
//             vendorId,
//           ],
//         };

//         const vendorAddressResult = await client.query(
//           saveVendorAddressQuery.text,
//           saveVendorAddressQuery.values
//         );

//         if (vendorAddressResult.rowCount !== 1) {
//           throw new Error('Failed to insert vendor address');
//         }

//         addresses.push({
//           id: vendorAddressResult.rows[0].id,
//           billing_address: addressInput.billing_address,
//           billing_city: addressInput.billing_city,
//           billing_zip: addressInput.billing_zip,
//           billing_state: addressInput.billing_state,
//           billing_country: addressInput.billing_country,
//           shipping_address: addressInput.shipping_address,
//           shipping_city: addressInput.shipping_city,
//           shipping_zip: addressInput.shipping_zip,
//           shipping_state: addressInput.shipping_state,
//           shipping_country: addressInput.shipping_country,
//         });
//       }



//         // Commit the transaction if all operations are successful
//         await client.query('COMMIT');

        
//         const response = {
//           status: 'success',
//           id: vendorId,
//           // Include other response data as needed
          
//           ...vendorResult.rows[0], // Include Vendor data
//           ...vendorDetailsResult.rows[0], // Include Vendor details data
//           addresses, // Include the array of addresses
//           ...vendorContactPersonResult.rows[0], // Include contact person data
          
          
//           addType: vendorAddressResult.rows[0].add_type,
//           contactFirstName: vendorContactPersonResult.rows[0].contact_first_name,
//           contactLastName: vendorContactPersonResult.rows[0].contact_last_name,
//           contactEmail: vendorContactPersonResult.rows[0].contact_email,
//           contactPhone: vendorContactPersonResult.rows[0].contact_phone,
//           contactJobRole: vendorContactPersonResult.rows[0].contact_job_role,
          

//         };


//         return response;
//       } catch (error) {

        
//         await client.query('ROLLBACK');
//         throw error;
        
//       } finally {
//         // Release the client back to the pool
//         client.release();
//       }
//     },

//   },


// };
// ================================================================================================================


// module.exports = resolvers;
// const { db } = require("../../db/index");

// const resolvers = {
//   Query: {
//     getVendors: async () => {
//       try {
//         const query = {
//           text: `
//             SELECT
//               c.id,
//               c.name,
//               c.first_name,
//               c.middle_name,
//               c.last_name,
//               c.type,
//               c.category,
//               c.email,
//               c.work_phone,
//               c.phone,
//               cd.currency,
//               cd.terms,
//               cd.amount,
//               ca.billing_address,
//               ca.billing_city,
//               ca.billing_zip,
//               ca.billing_state,
//               ca.billing_country,
//               ca.shipping_address,
//               ca.shipping_city,
//               ca.shipping_zip,
//               ca.shipping_state,
//               ca.shipping_country,
//               ccp.contact_first_name,
//               ccp.contact_last_name,
//               ccp.contact_email,
//               ccp.contact_phone,
//               ccp.contact_job_role
//             FROM vendors AS c
//             INNER JOIN vendor_details AS cd ON c.id = cd.vendor_id
//             INNER JOIN vendor_address AS ca ON c.id = ca.vendor_id
//             INNER JOIN vendor_contact_person AS ccp ON c.id = ccp.vendor_id;
//           `,
//         };

//         const result = await db.query(query.text);
//         if (result.rowCount > 0) {
//           const response = {
//             code: 200,
//             status: 'success',
//             count: result.rowCount,
//             data: result.rows,
//           };

//           return response;
//         } else {
//           const response = {
//             code: 404,
//             status: 'notfound',
//             count: 0,
//             data: null,
//           };

//           return response;
//         }
//       } catch (error) {
//         const response = {
//           code: 500,
//           status: 'error',
//           count: 0,
//           data: null,
//         };

//         return response;
//       }
//     },

//     getVendor: async (_, { id }) => {
//       try {
//         const query = {
//           text: `
//             SELECT
//               c.id,
//               c.name,
//               c.first_name,
//               c.middle_name,
//               c.last_name,
//               c.type,
//               c.category,
//               c.email,
//               c.work_phone,
//               c.phone,
//               cd.currency,
//               cd.terms,
//               cd.amount,
//               ca.billing_address,
//               ca.billing_city,
//               ca.billing_zip,
//               ca.billing_state,
//               ca.billing_country,
//               ca.shipping_address,
//               ca.shipping_city,
//               ca.shipping_zip,
//               ca.shipping_state,
//               ca.shipping_country,
//               ccp.contact_first_name,
//               ccp.contact_last_name,
//               ccp.contact_email,
//               ccp.contact_phone,
//               ccp.contact_job_role
//             FROM vendors AS c
//             INNER JOIN vendor_details AS cd ON c.id = cd.vendor_id
//             INNER JOIN vendor_address AS ca ON c.id = ca.vendor_id
//             INNER JOIN vendor_contact_person AS ccp ON c.id = ccp.vendor_id
//             WHERE c.id = $1;
//           `,
//           values: [id],
//         };

//         const result = await db.query(query.text, query.values);

//         if (result.rowCount > 0) {
//           const response = {
//             code: 200,
//             status: 'success',
//             data: result.rows[0],
//           };
//           return response;
//         } else {
//           const response = {
//             code: 404,
//             status: 'notfound',
//             data: null,
//           };
//           return response;
//         }
//       } catch (error) {
//         const response = {
//           code: 500,
//           status: 'error',
//           data: null,
//         };
//         return response;
//       }
//     },
//   },

//   Mutation: {
//     saveVendor: async (_, content) => {
//       const client = await db.connect();

//       try {
//         await client.query('BEGIN');

//         // SAVING Vendor
//         const saveVendorQuery = {
//           text: `INSERT INTO vendors (name, first_name, middle_name, last_name, type, category, email, work_phone, phone ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
//           values: [
//             content.name,
//             content.first_name,
//             content.middle_name,
//             content.last_name,
//             content.type,
//             content.category,
//             content.email,
//             content.work_phone,
//             content.phone,
//           ],
//         };

//         const vendorResult = await client.query(
//           saveVendorQuery.text,
//           saveVendorQuery.values
//         );

//         if (vendorResult.rowCount !== 1) {
//           throw new Error('Failed to insert vendor');
//         }

//         const vendorId = vendorResult.rows[0].id;

//         // SAVING Vendor DETAILS
//         const saveVendorDetailsQuery = {
//           text: `INSERT INTO vendor_details (currency, terms, amount, vendor_id) VALUES ($1, $2, $3, $4) RETURNING *`,
//           values: [
//             content.currency,
//             content.terms,
//             content.amount,
//             vendorId,
//           ],
//         };

//         const vendorDetailsResult = await client.query(
//           saveVendorDetailsQuery.text,
//           saveVendorDetailsQuery.values
//         );

//         if (vendorDetailsResult.rowCount !== 1) {
//           throw Error('Failed to insert vendor details');
//         }

//         // SAVING Vendor CONTACT PERSON
//         const saveVendorContactPersonQuery = {
//           text: `INSERT INTO vendor_contact_person (contact_first_name, contact_last_name, contact_email, contact_phone, contact_job_role, vendor_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
//           values: [
//             content.contact_first_name,
//             content.contact_last_name,
//             content.contact_email,
//             content.contact_phone,
//             content.contact_job_role,
//             vendorId,
//           ],
//         };

//         const vendorContactPersonResult = await client.query(
//           saveVendorContactPersonQuery.text,
//           saveVendorContactPersonQuery.values
//         );

//         if (vendorContactPersonResult.rowCount !== 1) {
//           throw new Error('Failed to insert vendor contact person');
//         }

//         // SAVING Vendor ADDRESSES (Array of Addresses)
//         const addresses = [];

//         for (const addressInput of content.addresses) {
//           const saveVendorAddressQuery = {
//             text: `INSERT INTO vendor_address (billing_address, billing_city, billing_zip, billing_state, billing_country, shipping_address, shipping_city, shipping_zip, shipping_state, shipping_country, vendor_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
//             values: [
//               addressInput.billing_address,
//               addressInput.billing_city,
//               addressInput.billing_zip,
//               addressInput.billing_state,
//               addressInput.billing_country,
//               addressInput.shipping_address,
//               addressInput.shipping_city,
//               addressInput.shipping_zip,
//               addressInput.shipping_state,
//               addressInput.shipping_country,
//               vendorId,
//             ],
//           };

//           const vendorAddressResult = await client.query(
//             saveVendorAddressQuery.text,
//             saveVendorAddressQuery.values
//           );

//           if (vendorAddressResult.rowCount !== 1) {
//             throw new Error('Failed to insert vendor address');
//           }

//           addresses.push({
//             id: vendorAddressResult.rows[0].id,
//             billing_address: addressInput.billing_address,
//             billing_city: addressInput.billing_city,
//             billing_zip: addressInput.billing_zip,
//             billing_state: addressInput.billing_state,
//             billing_country: addressInput.billing_country,
//             shipping_address: addressInput.shipping_address,
//             shipping_city: addressInput.shipping_city,
//             shipping_zip: addressInput.shipping_zip,
//             shipping_state: addressInput.shipping_state,
//             shipping_country: addressInput.shipping_country,
//           });
//         }

//         // Commit the transaction if all operations are successful
//         await client.query('COMMIT');

//         const response = {
//           status: 'success',
//           id: vendorId,
//           ...vendorResult.rows[0], // Include Vendor data
//           ...vendorDetailsResult.rows[0], // Include Vendor details data
//           addresses, // Include the array of addresses
//           ...vendorContactPersonResult.rows[0], // Include contact person data
//         };

//         return response;
//       } catch (error) {
//         await client.query('ROLLBACK');
//         throw error;
//       } finally {
//         // Release the client back to the pool
//         client.release();
//       }
//     },
//   },
// };

// module.exports = resolvers;

// ==============================================================================================================================================================

const { db } = require("../../db/index");

const resolvers = {
  Query: {
    getVendor: async (_, { id }) => {
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
            FROM vendors AS c
            INNER JOIN vendor_details AS cd ON c.id = cd.vendor_id
            INNER JOIN vendor_address AS ca ON c.id = ca.vendor_id
            INNER JOIN vendor_contact_person AS ccp ON c.id = ccp.vendor_id
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
            code: 404, // Set an appropriate status code for not found
            status: 'notfound',
            data: null, // You can set data to null or an empty object if needed
          };
          return response;
        }
      } catch (error) {
        const response = {
          code: 500,
          status: 'error',
          data: null,
        };
        return response;
      }
    },

    getVendors: async () => {
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
          FROM vendors AS c
          INNER JOIN vendor_details AS cd ON c.id = cd.vendor_id
          INNER JOIN vendor_address AS ca ON c.id = ca.vendor_id
          INNER JOIN vendor_contact_person AS ccp ON c.id = ccp.vendor_id;
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
          data: null,
        };

        return response;
      }
    },
  },

  Mutation: {
    saveVendor: async (_, content) => {
      const client = await db.connect();

      try {
        await client.query('BEGIN');

        // SAVING VENDOR
        const saveVendorQuery = {
          text: `INSERT INTO vendors (name, first_name, middle_name, last_name, type, category, email, work_phone, phone ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
          values: [content.name, content.first_name, content.middle_name, content.last_name, content.type, content.category, content.email, content.work_phone, content.phone],
        };

        const vendorResult = await client.query(saveVendorQuery.text, saveVendorQuery.values);

        if (vendorResult.rowCount !== 1) {
          throw new Error('Failed to insert vendor');
        }

        const vendorId = vendorResult.rows[0].id;

        // SAVING VENDOR DETAILS
        const saveVendorDetailsQuery = {
          text: `INSERT INTO vendor_details (currency, terms, amount, vendor_id) VALUES ($1, $2, $3, $4) RETURNING *`,
          values: [content.currency, content.terms, content.amount, vendorId],
        };

        const vendorDetailsResult = await client.query(saveVendorDetailsQuery.text, saveVendorDetailsQuery.values);

        if (vendorDetailsResult.rowCount !== 1) {
          throw new Error('Failed to insert vendor details');
        }

        // SAVING VENDOR ADDRESS
        const saveVendorAddressQuery = {
          text: `INSERT INTO vendor_address (billing_address, billing_city, billing_zip, billing_state, billing_country, shipping_address, shipping_city, shipping_zip, shipping_state, shipping_country, vendor_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
          values: [content.billing_address, content.billing_city, content.billing_zip, content.billing_state, content.billing_country, content.billing_address, content.billing_city, content.billing_zip, content.billing_state, content.billing_country, vendorId],
        };

        const vendorAddressResult = await client.query(saveVendorAddressQuery.text, saveVendorAddressQuery.values);

        if (vendorAddressResult.rowCount !== 1) {
          throw new Error('Failed to insert vendor address');
        }

        // SAVING VENDOR CONTACT PERSON
        const saveVendorContactPersonQuery = {
          text: `INSERT INTO vendor_contact_person (contact_first_name, contact_last_name, contact_email, contact_phone, contact_job_role, vendor_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
          values: [content.contact_first_name, content.contact_last_name, content.contact_email, content.contact_phone, content.contact_job_role, vendorId],
        };

        const vendorContactPersonResult = await client.query(saveVendorContactPersonQuery.text, saveVendorContactPersonQuery.values);

        if (vendorContactPersonResult.rowCount !== 1) {
          throw new Error('Failed to insert vendor contact person');
        }

        // Commit the transaction if all operations are successful
        await client.query('COMMIT');

        const response = {
          status: 'success',
          id: vendorId,
          // Include other response data as needed

          ...vendorResult.rows[0], // Include vendor data
          ...vendorDetailsResult.rows[0], // Include vendor details data
          ...vendorAddressResult.rows[0], // Include vendor address data
          ...vendorContactPersonResult.rows[0], //

          addType: vendorAddressResult.rows[0].add_type,
          contactFirstName: vendorContactPersonResult.rows[0].contact_first_name,
          contactLastName: vendorContactPersonResult.rows[0].contact_last_name,
          contactEmail: vendorContactPersonResult.rows[0].contact_email,
          contactPhone: vendorContactPersonResult.rows[0].contact_phone,
          contactJobRole: vendorContactPersonResult.rows[0].contact_job_role,
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

