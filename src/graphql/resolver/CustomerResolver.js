const { error } = require("console");
const { db } = require("../../db/index");

const resolvers = {
  Query: {
    getCustomer: async (_, { id }) => {
      try {
        const query = {
          text: `
                SELECT 
          Customer.UserID,
          Customer.CustomerID,
          Customer.category,
          Customer.company_name,
          Customer.Email,
          Customer.main_phone,
          Customer.work_phone,
          Customer.first_name,
          Customer.middle_name,
          Customer.last_name,
          Customer.display_name,
          Customer.Website,
          Customer.Amount,
          Customer.Currency,
          Customer.payment_terms,
          ARRAY_AGG(DISTINCT JSONB_BUILD_OBJECT(
              'location', customer_billing_address.location,
              'state', customer_billing_address.State,
              'city', customer_billing_address.City,
              'country', customer_billing_address.Country,
              'zipcode', customer_billing_address.ZipCode,
              'isdefault', customer_billing_address.IsDefault
          )) AS customer_billing_address,
          ARRAY_AGG(DISTINCT JSONB_BUILD_OBJECT(
              'location', Customer_Shipping_Addresses.location,
              'state', Customer_Shipping_Addresses.State,
              'city', Customer_Shipping_Addresses.City,
              'country', Customer_Shipping_Addresses.Country,
              'zipcode', Customer_Shipping_Addresses.ZipCode,
              'isdefault', Customer_Shipping_Addresses.IsDefault
          )) AS Customer_Shipping_Addresses,
          ARRAY_AGG(DISTINCT JSONB_BUILD_OBJECT(
              'cpfirstname', Customer_Contact_Person.CPFirstName,
              'cplastname', Customer_Contact_Person.CPLastName,
              'cpemail', Customer_Contact_Person.CPEmail,
              'cpcontact', Customer_Contact_Person.CPcontact,
              'cpjobrole', Customer_Contact_Person.CPJobRole
          )) AS Customer_Contact_Person
        FROM Customer
        LEFT JOIN customer_billing_address ON Customer.CustomerID = customer_billing_address.CustomerID
        LEFT JOIN Customer_Shipping_Addresses ON Customer.CustomerID = Customer_Shipping_Addresses.CustomerID
        LEFT JOIN Customer_Contact_Person ON Customer.CustomerID = Customer_Contact_Person.CustomerID
        WHERE Customer.CustomerID = $1
        GROUP BY 
            Customer.UserID,
            Customer.CustomerID,
            Customer.category,
            Customer.company_name,
            Customer.Email,
            Customer.main_phone,
            Customer.work_phone,
            Customer.first_name,
            Customer.middle_name,
            Customer.last_name,
            Customer.display_name,
            Customer.Website,
            Customer.Amount,
            Customer.Currency,
            Customer.payment_terms;
            `,
          values: [id],
        };

        const result = await db.query(query.text, query.values);
        console.log("Result in Customer resolver -------- ", JSON.stringify(result.rows));
        console.log("ID in Customer resolver --------------", id);
        

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
          Customer.UserID,
          Customer.CustomerID,
          Customer.category,
          Customer.company_name,
          Customer.Email,
          Customer.main_phone,
          Customer.work_phone,
          Customer.first_name,
          Customer.middle_name,
          Customer.last_name,
          Customer.display_name,
          Customer.Website,
          Customer.Amount,
          Customer.Currency,
          Customer.payment_terms,
          ARRAY_AGG(DISTINCT JSONB_BUILD_OBJECT(
              'location', customer_billing_address.location,
              'state', customer_billing_address.State,
              'city', customer_billing_address.City,
              'country', customer_billing_address.Country,
              'zipcode', customer_billing_address.ZipCode,
              'isdefault', customer_billing_address.IsDefault
          )) AS customer_billing_address,
          ARRAY_AGG(DISTINCT JSONB_BUILD_OBJECT(
              'location', Customer_Shipping_Addresses.location,
              'state', Customer_Shipping_Addresses.State,
              'city', Customer_Shipping_Addresses.City,
              'country', Customer_Shipping_Addresses.Country,
              'zipcode', Customer_Shipping_Addresses.ZipCode,
              'isdefault', Customer_Shipping_Addresses.IsDefault
          )) AS Customer_Shipping_Addresses,
          ARRAY_AGG(DISTINCT JSONB_BUILD_OBJECT(
              'cpfirstname', Customer_Contact_Person.CPFirstName,
              'cplastname', Customer_Contact_Person.CPLastName,
              'cpemail', Customer_Contact_Person.CPEmail,
              'cpcontact', Customer_Contact_Person.CPcontact,
              'cpjobrole', Customer_Contact_Person.CPJobRole
          )) AS Customer_Contact_Person
        FROM Customer
        LEFT JOIN customer_billing_address ON Customer.CustomerID = customer_billing_address.CustomerID
        LEFT JOIN Customer_Shipping_Addresses ON Customer.CustomerID = Customer_Shipping_Addresses.CustomerID
        LEFT JOIN Customer_Contact_Person ON Customer.CustomerID = Customer_Contact_Person.CustomerID
        GROUP BY 
            Customer.UserID,
            Customer.CustomerID,
            Customer.category,
            Customer.company_name,
            Customer.Email,
            Customer.main_phone,
            Customer.work_phone,
            Customer.first_name,
            Customer.middle_name,
            Customer.last_name,
            Customer.display_name,
            Customer.Website,
            Customer.Amount,
            Customer.Currency,
            Customer.payment_terms;          
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
      let input = content.input
      const client = await db.connect();
      // console.log("connection build on customer resolver");
      // console.log("Content in customerResolver:  ", input);
      // console.log("id", input.userid);
      
      let response;
      let customerResult;
      let customerBillingAddressResult;
      let customerShippingAddressResult;
      let customerContactPersonResult;
  
      try {
        // Begin a transaction
        await client.query('BEGIN');
  
        // SAVING CUSTOMER
        const saveCustomerQuery = {
          text: `
            INSERT INTO customer (
              userid,
              customerid,
              category,
              company_name,
              email,
              main_phone,
              work_phone,
              first_name,
              middle_name,
              last_name,
              display_name,
              website,
              amount,
              currency,
              payment_terms
            )
            VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
            )
            RETURNING *;
          `,
          values: [
            input.userid,
            input.customerid,
            input.category,
            input.company_name,
            input.email,
            input.main_phone,
            input.work_phone,
            input.first_name,
            input.middle_name,
            input.last_name,
            input.display_name,
            input.website,
            input.amount,
            input.currency,
            input.payment_terms,
          ],
        };
  
        customerResult = await client.query(saveCustomerQuery.text, saveCustomerQuery.values);
  
        if (customerResult.rowCount !== 1) {
          throw new Error('Failed to insert customer');
        }
  
        // SAVING CUSTOMER Billing ADDRESS
        const CustomerBillingAddresses = input.customer_billing_address;
        for (const CustomerBillingAddress of CustomerBillingAddresses) {
          const saveCustomerAddressQuery = {
            text: `
              INSERT INTO customer_billing_address (
                CustomerID,
                location,
                State,
                City,
                Country,
                ZipCode,
                IsDefault
              )
              VALUES (
                $1, $2, $3, $4, $5, $6, $7
              )
              RETURNING *;
            `,
            values: [
              input.customerid,
              CustomerBillingAddress.location,
              CustomerBillingAddress.state,
              CustomerBillingAddress.city,
              CustomerBillingAddress.country,
              CustomerBillingAddress.zipcode,
              CustomerBillingAddress.isdefault,
            ],
          };
  
          customerBillingAddressResult = await client.query(saveCustomerAddressQuery.text, saveCustomerAddressQuery.values);
          // console.log(customerBillingAddressResult);
  
          if (customerBillingAddressResult.rowCount !== 1) {
            throw new Error('Failed to insert customer billing address');
          }
        }
  
        // Save Customer Shipping Address
        const CustomerShippingAddresses = input.customer_shipping_addresses;
        for (const CustomerShippingAddress of CustomerShippingAddresses) {
          const saveCustomerShippingAddressQuery = {
            text: `
              INSERT INTO customer_shipping_addresses(
                CustomerID,
                location,
                State,
                City,
                Country,
                ZipCode,
                IsDefault
              )
              VALUES (
                $1, $2, $3, $4, $5, $6, $7
              )
              RETURNING *;
            `,
            values: [
              input.customerid,
              CustomerShippingAddress.location,
              CustomerShippingAddress.state,
              CustomerShippingAddress.city,
              CustomerShippingAddress.country,
              CustomerShippingAddress.zipcode,
              CustomerShippingAddress.isdefault,
            ],
          };
  
          customerShippingAddressResult = await client.query(saveCustomerShippingAddressQuery.text, saveCustomerShippingAddressQuery.values);
          // console.log(customerShippingAddressResult);
  
          if (customerShippingAddressResult.rowCount !== 1) {
            throw new Error('Failed to Insert Customer Shipping Address');
          }
        }
  
        const CustomerContactPersons = input.customer_contact_person;
        for (const CustomerContactPerson of CustomerContactPersons) {
          const saveContactPersonQuery = {
            text: `
              INSERT INTO customer_contact_person (
                CustomerID,
                CPFirstName,
                CPLastName,
                CPEmail,
                CPContact,
                CPJobRole
              )
              VALUES (
                $1, $2, $3, $4, $5, $6
              )
              RETURNING *;
            `,
            values: [
              input.customerid,
              CustomerContactPerson.cpfirstname,
              CustomerContactPerson.cplastname,
              CustomerContactPerson.cpemail,
              CustomerContactPerson.cpcontact,
              CustomerContactPerson.cpjobrole,
            ],
          };
  
          customerContactPersonResult = await client.query(saveContactPersonQuery.text, saveContactPersonQuery.values);

          console.log("contact person", customerContactPersonResult.rows[0]);
  
          if (customerContactPersonResult.rowCount !== 1) {
            throw new Error('Failed to insert customer contact person');
          }
        }
  
        response = {
          code: 200,
          status: 'success',
          id: input.customerid,
          data: {
            customer: customerResult.rows[0],
            billingAddresses: customerBillingAddressResult.rows,
            shippingAddresses: customerShippingAddressResult.rows,
            contactPersons: customerContactPersonResult.rows,
          },
        };
        console.log(response.data.contactPersons);
  
        // Commit the transaction if all operations are successful
        await client.query('COMMIT');
  
        console.log("Transaction Successful");
        return response;
      } catch (error) {
        console.log(error);
        await client.query('ROLLBACK');
        const response = {
          code: 500,
          status: 'error',
          data: null,
          error: error.message,
        };
        return response;
      } finally {
        client.release();
      }
    },
  },
  

  Customer: {
    customer_billing_address: async (parent, _, { db }) => {
      try {
        const query = {
          text: `SELECT location, state, city, country, zipcode, isdefault FROM customer_billing_address WHERE customerid = $1 `,
          values: [parent.customerid],
        };
        const result = await db.query(query.text, query.values);

        console.log('Billing Address Result:', result.rows); 

        return result.rows;
      } catch (error) {
        
        console.error('Billing Address Resolver Error:', error);

        throw new Error("Failed to retrieve billing address");
      }
    },
    customer_shipping_addresses: async (parent, _, { db }) => {
      try {
        const query = {
          text: `SELECT location, city, state, country FROM customer_shipping_addresses WHERE customerid = $1 `,
          values: [parent.customerid],
        };
        const result = await db.query(query.text, query.values);
        console.log('Shipping Addresses Result:', result.rows);
        return result.rows;
      } catch (error) {
        console.error('Shipping Addresses Resolver Error:', error);
        throw new Error("Failed to retrieve shipping address");
      }
    },
    customer_contact_person: async (parent, _, { db }) => {
      try {
        const query = {
          text: `SELECT cpfirstname, cplastname, cpemail, cpcontact, cpjobrole FROM customer_contact_person WHERE customerid = $1`,
          values: [parent.customerid],
        };
        const result = await db.query(query.text, query.values);
        return result.rows;
      } catch (error) {
        throw new Error("Failed to retrieve customer contact person");
      }
    },
  },
};

module.exports = resolvers;


// Mutation: {
//   saveCustomer: async (_, content) => {
//     const client = await db.connect();
//     console.log("connection build on customer resolver");
//     console.log("Content in customerResolver:  ", content);
//     let response;
//     let customerResult;
//     let customerBillingAddressResult;
//     let customerShippingAddressResult;
//     let customerContactPersonResult;
    
//     try {
//       // Begin a transaction
//       await client.query('BEGIN');

//       // SAVING CUSTOMER
//       const saveCustomerQuery = {
//         text: `
//          INSERT INTO customer (
//           userid,
//           customerid,
//           category,
//           company_name,
//           email,
//           main_phone,
//           work_phone,
//           first_name,
//           middle_name,
//           last_name,
//           display_name,
//           website,
//           amount,
//           currency,
//           payment_terms
//         )
//         VALUES (
//           $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
//         )
//         RETURNING *;
//         `,
//         values: [
//           content.userid,
//           content.customerid,
//           content.category,
//           content.company_name,
//           content.email,
//           content.main_phone,
//           content.work_phone,
//           content.first_name,
//           content.middle_name,
//           content.last_name,
//           content.display_name,
//           content.website,
//           content.amount,
//           content.currency,
//           content.payment_terms,
//         ],
//       };

//      customerResult = await client.query(saveCustomerQuery.text,
//         saveCustomerQuery.values);

//       if (customerResult.rowCount !== 1) {
//         throw new Error('Failed to insert customer');
//       }

//       // SAVING CUSTOMER Billing ADDRESS
//       const CustomerBillingAddresses = content.customer_billing_address; 
//       for (const CustomerBillingAddress of CustomerBillingAddresses ){
//         const saveCustomerAddressQuery = {
//           text: `
//             INSERT INTO customer_billing_address (
//               CustomerID,
//               location,
//               State,
//               City,
//               Country,
//               ZipCode,
//               IsDefault
//             )
//             VALUES (
//               $1, $2, $3, $4, $5, $6, $7
//             )
//             RETURNING *;
//           `,
//           values: [
//             content.customerid,
//             CustomerBillingAddress.location,
//             CustomerBillingAddress.state,
//             CustomerBillingAddress.city,
//             CustomerBillingAddress.country,
//             CustomerBillingAddress.zipcode,
//             CustomerBillingAddress.isdefault,
//           ],
//         };

      
//        customerBillingAddressResult = await client.query(saveCustomerAddressQuery.text, saveCustomerAddressQuery.values);

//       if (customerBillingAddressResult.rowCount !== 1) {
//         throw new Error('Failed to insert customer billing address');
//     }
//   };

//       //Save Customer Shipping Address
//       const CustomerShippingAddresses = content.customer_shipping_addresses;
//       for(const CustomerShippingAddress of CustomerShippingAddresses){
//         const saveCustomerShippingAddressQuery ={
//           text: `
//           INSERT INTO customer_shipping_addresses(
//             CustomerID,
//             location,
//             State,
//             City,
//             Country,
//             ZipCode,
//             IsDefault
//           )
//           VALUES (
//             $1, $2, $3, $4, $5, $6, $7
//           )
//           RETURNING *;
//           `,
//           values:[
//             content.customerid,
//             CustomerShippingAddress.location,
//             CustomerShippingAddress.state,
//             CustomerShippingAddress.city,
//             CustomerShippingAddress.country,
//             CustomerShippingAddress.zipcode,
//             CustomerShippingAddress.isdefault,
//           ],
//         };
      
//       customerShippingAddressResult = await client.query(saveCustomerShippingAddressQuery.text,saveCustomerShippingAddressQuery.values);

//       if(customerShippingAddressResult.rowCount !== 1){
//         throw new Error('Failed to Insert Customer Shipping Address');
//       }
//     };

//        const CustomerContactPersons = content.customer_contact_person;
//        for (const CustomerContactPerson of CustomerContactPersons){
//         const saveContactPersonQuery = {
//           text: `
//           INSERT INTO customer_contact_person (
//             CustomerID,
//             CPFirstName,
//             CPLastName,
//             CPEmail,
//             CPContact,
//             CPJobRole
//           )
//           VALUES (
//             $1, $2, $3, $4, $5, $6
//           )
//           RETURNING *;
//           `,
//           values: [
//             content.customerid,
//             CustomerContactPerson.contact_first_name,
//             CustomerContactPerson.contact_last_name,
//             CustomerContactPerson.contact_email,
//             CustomerContactPerson.contact_phone,
//             CustomerContactPerson.contact_job_role,
//           ],
//         };
        
//         customerContactPersonResult = await client.query(saveContactPersonQuery.text, saveContactPersonQuery.values);
        
//         if (customerContactPersonResult.rowCount !== 1) {
//           throw new Error('Failed to insert customer contact person');
//         }
//       };
        
//       response = {
//         code: 200,
//         status: 'success',
//         id: content.customerid,
//         customerResult: customerResult.rows[0],
//         customerBillingAddressCount: customerBillingAddressResult.rowCount,
//         customerShippingAddressCount: customerShippingAddressResult.rowCount,
//         customerContactPersonCount: customerContactPersonResult.rowCount,
//       };

//       // Commit the transaction if all operations are successful
//     await client.query('COMMIT');

//     console.log("Transaction Successful")
//     return response;
//     } catch  (error) {
//       console.log(error)
//       await client.query('ROLLBACK');
//       const response ={
//         code: 500,
//         status:'error',
//         data: null,
//         error:error.message,
//       };
//       return response;
//       // throw error;
//     } finally {
//       client.release();
//     }
//   },
// },