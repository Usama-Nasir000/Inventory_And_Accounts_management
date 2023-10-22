// ==============================================================================================================================================================
const { db } = require("../../db/index");

const resolvers = {
  Query: {
    getVendor: async (_, { id }) => {
      try {
        const query = {
          text: `
            SELECT
            v.userid,
            v.vendorid,
            v.vendor_name,
            v.firstname,
            v.middlename,
            v.lastname,
            v.vendor_type,
            v.category,
            v.work_phone,
            v.phone,
            v.email,
            vba.address,
            vba.city,
            vba.state,
            vba.country,
            vba.isdefault,
            vsa.address,
            vsa.city,
            vsa.state,
            vsa.country,
            vsa.isdefault,
            vcp.cpfirstname,
            vcp.cplastname,
            vcp.cpemail,
            vcp.cpphone,
            vcp.cpjobrole
            FROM vendor AS v
            LEFT JOIN vendorbillingaddresses AS vba ON v.vendorid = vba.vendorid
            LEFT JOIN vendorshippingaddresses AS vsa ON v.vendorid = vsa.vendorid
            LEFT JOIN vendorcontactperson AS vcp ON v.vendorid = vcp.vendorid
            WHERE vendorid = $1;
            `,
            values: [id],
          };
          // INNER JOIN User ON vendor.UserID = User.UserID

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
          v.userid,
          v.vendorid,
          v.vendor_name,
          v.firstname,
          v.middlename,
          v.lastname,
          v.vendor_type,
          v.category,
          v.work_phone, 
          v.phone,
          v.email,
          vba.address,
          vba.city,
          vba.state,
          vba.country,
          vba.isdefault,
          vsa.address,
          vsa.city,
          vsa.state,
          vsa.country,
          vsa.isdefault,
          vcp.cpfirstname,
          vcp.cplastname,
          vcp.cpemail,
          vcp.cpphone,
          vcp.cpjobrole
          FROM vendor AS v
          LEFT JOIN vendorbillingaddresses AS vba ON v.vendorid = vba.vendorid
          LEFT JOIN vendorshippingaddresses AS vsa ON v.vendorid = vsa.vendorid
          LEFT JOIN vendorcontactperson AS vcp ON v.vendorid = vcp.vendorid
          INNER JOIN User ON vendor.UserID = User.UserID
          `
        }; 

        const result = await db.query(query.text);
        // console.log(result);
        // console.log("ueryyyyyy", query.text);
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
        console.log(error);
        return response;
      }
    },
  },




  Mutation: {
    saveVendor: async (_, content) => {
      const client = await db.connect();
      console.log("connection build on vendor resolver");
      console.log("Content in vendorResolver:  ",content);
 
      try {
        await client.query('BEGIN');

        const saveVendorQuery = {
          text: `INSERT INTO vendor (userid, vendorid, vendor_name, firstname, middlename, lastname, vendor_type, category, work_phone, phone, email)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *;
          `,
          values: [
            content.userid,
            content.vendorid,
            content.vendor_name,
            content.firstname,
            content.middlename,
            content.lastname,
            content.vendor_type,
            content.category,
            content.work_phone,
            content.phone,
            content.email
          ],
        };

        const vendorResult = await client.query(saveVendorQuery.text, saveVendorQuery.values);


        // Insert data into vendorbillingaddresses table
        const saveBillingAddressQuery = {
          text: `INSERT INTO vendorbillingaddresses (UserID, VendorID, Address, City, State, Country, IsDefault)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
          `,
          values: [
            content.userid,
            content.vendorid,
            content.billing_address.address,
            content.billing_address.city,
            content.billing_address.state,
            content.billing_address.country,
            content.billing_address.isdefault
          ],

        };
        await client.query(saveBillingAddressQuery.text, saveBillingAddressQuery.values);

        // Insert data into vendorshippingaddresses table
        const saveShippingAddressQuery = {
          text: `INSERT INTO vendorshippingaddresses (UserID, VendorID, Address, City, State, Country, IsDefault)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
          `,
          values: [
            content.userid,
            content.vendorid,
            content.shipping_address.address,
            content.shipping_address.city,
            content.shipping_address.state,
            content.shipping_address.country,
            content.shipping_address.isdefault
          ],
        };
        await client.query(saveShippingAddressQuery.text, saveShippingAddressQuery.values);

        // Insert data into vendorcontactperson table
        const saveContactPersonQuery = {
          text: `INSERT INTO vendorcontactperson (UserID, VendorID, CPFirstName, CPLastName, CPEmail, CPPhone, CPJobRole)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
          `,
          values: [
            content.userid,
            content.vendorid,
            content.vendor_contact_person.contact_first_name,
            content.vendor_contact_person.contact_last_name,
            content.vendor_contact_person.contact_email,
            content.vendor_contact_person.contact_phone,
            content.vendor_contact_person.contact_job_role
          ],
        };
        await client.query(saveContactPersonQuery.text, saveContactPersonQuery.values);

        // Commit the transaction if everything is successful
        await client.query('COMMIT');

        // Return the newly created vendor
        return vendorResult.rows[0];
      } catch (error) {
        console.log(error);
        await client.query('ROLLBACK');
        const response = {
          status: 'error',
          message: error.message,
        };
        return response;
      } finally {
        client.release();
      }
    },
    // Add mutation resolvers for saving vendorbillingaddresses, vendorshippingaddresses, and vendorcontactperson
  },
  Vendor: {
    billing_address: async (parent, _, { db }) => {
      try {
        const query = {
          text: `SELECT address, city, state, country FROM vendoraddresses WHERE vendorid = $1 AND addresstype = 'billing'`,
          values: [parent.vendorid],
        };
        const result = await db.query(query.text, query.values);
        return result.rows[0];
      } catch (error) {
        throw new Error("Failed to retrieve billing address");
      }
    },
    shipping_address: async (parent, _, { db }) => {
      try {
        const query = {
          text: `SELECT address, city, state, country FROM vendoraddresses WHERE vendorid = $1 AND addresstype = 'shipping'`,
          values: [parent.vendorid],
        };
        const result = await db.query(query.text, query.values);
        return result.rows[0];
      } catch (error) {
        throw new Error("Failed to retrieve shipping address");
      }
    },
    vendor_contact_person: async (parent, _, { db }) => {
      try {
        const query = {
          text: `SELECT cpfirstname, cplastname, cpemail, cpphone, cpjobrole FROM vendorcontactperson WHERE vendorid = $1`,
          values: [parent.vendorid],
        };
        const result = await db.query(query.text, query.values);
        return result.rows[0];
      } catch (error) {
        throw new Error("Failed to retrieve vendor contact person");
      }
    },
  },
};

module.exports = resolvers;


// =====================================================================================================================================
//   Mutation: {
//     saveVendor: async (_, content) => {
//       const client = await db.connect();

//       try {
//         await client.query('BEGIN');

//         // SAVING VENDOR
//         const saveVendorQuery = {
//           text: `INSERT INTO vendor (userid, vendorid, vendor_type, vendor_name, firstname, middlename, lastname, category, work_phone, phone, email)
//           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *;
//           `,
//           values: [content.name, content.first_name, content.middle_name, content.last_name, content.type, content.category, content.email, content.work_phone, content.phone],
//         };
//         console.log(content.name, content.first_name, content.middle_name, content.last_name, content.type, content.category, content.email, content.work_phone, content.phone);

//         const vendorResult = await client.query(saveVendorQuery.text, saveVendorQuery.values);

//         if (vendorResult.rowCount !== 1) {
//           throw new Error('Failed to insert vendor');
//         }

//         const vendorId = vendorResult.rows[0].id;

//         // SAVING VENDOR DETAILS
//         // const saveVendorDetailsQuery = {
//         //   text: `INSERT INTO vendor_details (currency, terms, amount, vendor_id) VALUES ($1, $2, $3, $4) RETURNING *`,
//         //   values: [content.currency, content.terms, content.amount, vendorId],
//         // };

//         // const vendorDetailsResult = await client.query(saveVendorDetailsQuery.text, saveVendorDetailsQuery.values);

//         // if (vendorDetailsResult.rowCount !== 1) {
//         //   throw new Error('Failed to insert vendor details');
//         // }

//         // SAVING VENDOR ADDRESS
//         const saveVendorAddressQuery = {
//           text: `INSERT INTO vendor_address (billing_address, billing_city, billing_zip, billing_state, billing_country, shipping_address, shipping_city, shipping_zip, shipping_state, shipping_country, vendor_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
//           values: [content.billing_address, content.billing_city, content.billing_zip, content.billing_state, content.billing_country, content.billing_address, content.billing_city, content.billing_zip, content.billing_state, content.billing_country, vendorId],
//         };

//         const vendorAddressResult = await client.query(saveVendorAddressQuery.text, saveVendorAddressQuery.values);

//         if (vendorAddressResult.rowCount !== 1) {
//           throw new Error('Failed to insert vendor address');
//         }

//         // SAVING VENDOR CONTACT PERSON
//         const saveVendorContactPersonQuery = {
//           text: `INSERT INTO vendor_contact_person (contact_first_name, contact_last_name, contact_email, contact_phone, contact_job_role, vendor_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
//           values: [content.contact_first_name, content.contact_last_name, content.contact_email, content.contact_phone, content.contact_job_role, vendorId],
//         };

//         const vendorContactPersonResult = await client.query(saveVendorContactPersonQuery.text, saveVendorContactPersonQuery.values);

//         if (vendorContactPersonResult.rowCount !== 1) {
//           throw new Error('Failed to insert vendor contact person');
//         }

//         // Commit the transaction if all operations are successful
//         await client.query('COMMIT');

//         const response = {
//           status: 'success',
//           id: vendorId,
//           // Include other response data as needed

//           ...vendorResult.rows[0], // Include vendor data
//           // ...vendorDetailsResult.rows[0], // Include vendor details data
//           ...vendorAddressResult.rows[0], // Include vendor address data
//           ...vendorContactPersonResult.rows[0], //

//           addType: vendorAddressResult.rows[0].add_type,
//           // contactFirstName: vendorContactPersonResult.rows[0].contact_first_name,
//           // contactLastName: vendorContactPersonResult.rows[0].contact_last_name,
//           // contactEmail: vendorContactPersonResult.rows[0].contact_email,
//           // contactPhone: vendorContactPersonResult.rows[0].contact_phone,
//           // contactJobRole: vendorContactPersonResult.rows[0].contact_job_role,
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
// =====================================================================================================================================================================================



// const { randomBytes } = require("crypto");
// const { db } = require("../../db/index");

// const resolvers = {
//   Query: {
//     getVendors: () => {
//       // Implement logic to fetch vendors data
//       return getVendorsData(); // Some function to fetch vendors data
//     },
//     getVendor: (_, { id }) => {
//       // Implement logic to fetch a specific vendor data based on ID
//       return getVendorData(id); // Some function to fetch specific vendor data
//     },
//   },
//   Mutation: {
//     saveVendor: async (_,content) => {
//       const client = await db.connect();

//       try {
//         await client.query('BEGIN');

//         const id = randomBytes(5).toString("hex");

//         const {
//           Name,
//           first_name,
//           middle_name,
//           last_name,
//           type,
//           category,
//           email,
//           work_phone,
//           phone,
//           billing_address,
//           shipping_address,
//           contact_first_name,
//           contact_last_name,
//           contact_email,
//           contact_phone,
//           contact_job_role,
//         } = content;

//         const saveVendorQuery = {
//           text: `INSERT INTO Vendor (id, name, first_name, middle_name, last_name, type, category, email, work_phone, phone ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
//           values: [id, Name, first_name, middle_name, last_name, type, category, email, work_phone, phone],
//         };

//         const vendorResult = await client.query(saveVendorQuery.text, saveVendorQuery.values);

//         if (vendorResult.rowCount !== 1) {
//           throw new Error('Failed to insert vendor');
//         }

//         const vendorId = vendorResult.rows[0].id;

//         // ... other operations for vendor details, vendor address, and vendor contact person
//         // You need to implement similar database operations for these fields as well

//         // Commit the transaction if all operations are successful
//         await client.query('COMMIT');

//         return {
//           status: 'success',
//           id: vendorId,
//           name: Name,
//           first_name,
//           middle_name,
//           last_name,
//           type,
//           category,
//           email,
//           work_phone,
//           phone,
//           billing_address,
//           shipping_address,
//           vendor_contact_person: {
//             contact_first_name,
//             contact_last_name,
//             contact_email,
//             contact_phone,
//             contact_job_role,
//           },
//         };
//       } catch (error) {
//         await client.query('ROLLBACK');
//         throw error;
//       } finally {
//         client.release();
//       }
//     },
//   },
// };

// module.exports = resolvers;
