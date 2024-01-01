const { db } = require("../../db/index")

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
              'billing_location', CustomerBillingAddresses.location,
              'billing_state', CustomerBillingAddresses.State,
              'billing_city', CustomerBillingAddresses.City,
              'billing_country', CustomerBillingAddresses.Country,
              'billing_zipcode', CustomerBillingAddresses.ZipCode,
              'billing_isdefault', CustomerBillingAddresses.IsDefault
          )) AS billing_addresses,
          ARRAY_AGG(DISTINCT JSONB_BUILD_OBJECT(
              'shipping_location', CustomerShippingAddresses.location,
              'shipping_state', CustomerShippingAddresses.State,
              'shipping_city', CustomerShippingAddresses.City,
              'shipping_country', CustomerShippingAddresses.Country,
              'shipping_zipcode', CustomerShippingAddresses.ZipCode,
              'shipping_isdefault', CustomerShippingAddresses.IsDefault
          )) AS shipping_addresses,
          ARRAY_AGG(DISTINCT JSONB_BUILD_OBJECT(
              'contact_first_name', CustomerContactPerson.CPFirstName,
              'contact_last_name', CustomerContactPerson.CPLastName,
              'contact_email', CustomerContactPerson.CPEmail,
              'contact_phone', CustomerContactPerson.CPcontact,
              'contact_job_role', CustomerContactPerson.CPJobRole
          )) AS contact_persons
      FROM Customer
      LEFT JOIN CustomerBillingAddresses ON Customer.CustomerID = CustomerBillingAddresses.CustomerID
      LEFT JOIN CustomerShippingAddresses ON Customer.CustomerID = CustomerShippingAddresses.CustomerID
      LEFT JOIN CustomerContactPerson ON Customer.CustomerID = CustomerContactPerson.CustomerID
      where customer.customerid = $1
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
        // console.log(id);
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
              'billing_location', CustomerBillingAddresses.location,
              'billing_state', CustomerBillingAddresses.State,
              'billing_city', CustomerBillingAddresses.City,
              'billing_country', CustomerBillingAddresses.Country,
              'billing_zipcode', CustomerBillingAddresses.ZipCode,
              'billing_isdefault', CustomerBillingAddresses.IsDefault
          )) AS billing_addresses,
          ARRAY_AGG(DISTINCT JSONB_BUILD_OBJECT(
              'shipping_location', CustomerShippingAddresses.location,
              'shipping_state', CustomerShippingAddresses.State,
              'shipping_city', CustomerShippingAddresses.City,
              'shipping_country', CustomerShippingAddresses.Country,
              'shipping_zipcode', CustomerShippingAddresses.ZipCode,
              'shipping_isdefault', CustomerShippingAddresses.IsDefault
          )) AS shipping_addresses,
          ARRAY_AGG(DISTINCT JSONB_BUILD_OBJECT(
              'contact_first_name', CustomerContactPerson.CPFirstName,
              'contact_last_name', CustomerContactPerson.CPLastName,
              'contact_email', CustomerContactPerson.CPEmail,
              'contact_phone', CustomerContactPerson.CPcontact,
              'contact_job_role', CustomerContactPerson.CPJobRole
          )) AS contact_persons
      FROM Customer
      LEFT JOIN CustomerBillingAddresses ON Customer.CustomerID = CustomerBillingAddresses.CustomerID
      LEFT JOIN CustomerShippingAddresses ON Customer.CustomerID = CustomerShippingAddresses.CustomerID
      LEFT JOIN CustomerContactPerson ON Customer.CustomerID = CustomerContactPerson.CustomerID
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
      const client = await db.connect();
      console.log("connection build on customer resolver");
      console.log("Content in customerResolver:  ", content);
      let response;
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
            content.userid,
            content.customerid,
            content.category,
            content.company_name,
            content.email,
            content.main_phone,
            content.work_phone,
            content.first_name,
            content.middle_name,
            content.last_name,
            content.display_name,
            content.website,
            content.amount,
            content.currency,
            content.payment_terms,
          ],
        };

        const customerResult = await client.query(saveCustomerQuery.text,
          saveCustomerQuery.values);

        if (customerResult.rowCount !== 1) {
          throw new Error('Failed to insert customer');
        }

        // SAVING CUSTOMER Billing ADDRESS
        for (const CustomerBillingAddress of content.billing_address) {
          const saveCustomerAddressQuery = {
            text: `
              INSERT INTO CustomerBillingAddresses (
                UserID,
                CustomerID,
                location,
                State,
                City,
                Country,
                ZipCode,
                IsDefault
              )
              VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8
              )
              RETURNING *;
            `,
            values: [
              content.userid,
              content.customerid,
              CustomerBillingAddress.location,
              CustomerBillingAddress.state,
              CustomerBillingAddress.city,
              CustomerBillingAddress.country,
              CustomerBillingAddress.zipcode,
              CustomerBillingAddress.isdefault,
            ],
          };

        }
        const customerBillingAddressResult = await client.query(saveCustomerAddressQuery.text, saveCustomerAddressQuery.values);

        if (customerBillingAddressResult.rowCount !== 1) {
          throw new Error('Failed to insert customer billing address');
      }

        //Save Customer Shipping Address
        for(const CustomerShippingAddress of content.shipping_address){
          const saveCustomerShippingAddressQuery ={
            text: `
            INSERT INTO customershippingaddresses(
              UserID,
              CustomerID,
              location,
              State,
              City,
              Country,
              ZipCode,
              IsDefault
            )
            VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8
            )
            RETURNING *;
            `,
            values:[
              content.userid,
              content.customerid,
              CustomerShippingAddress.location,
              CustomerShippingAddress.state,
              CustomerShippingAddress.city,
              CustomerShippingAddress.country,
              CustomerShippingAddress.zipcode,
              CustomerShippingAddress.isdefault,
            ],
          };
        }
        const CustomerShippingAddressResult = await client.query(saveCustomerShippingAddressQuery.text,saveCustomerShippingAddressQuery.values);

        if(CustomerShippingAddressResult !== 1){
          throw new Error('Failed to Insert Customer Shipping Address');
        }

         for (const CustomerContactPerson of content.customer_contact_person) {
          const saveContactPersonQuery = {
            text: `
            INSERT INTO customerContactPerson (
              UserID,
              CustomerID,
              CPFirstName,
              CPLastName,
              CPEmail,
              CPContact,
              CPJobRole
            )
            VALUES (
              $1, $2, $3, $4, $5, $6, $7
            )
            RETURNING *;
            `,
            values: [
              content.userid,
              content.customerid,
              CustomerContactPerson.contact_first_name,
              CustomerContactPerson.contact_last_name,
              CustomerContactPerson.contact_email,
              CustomerContactPerson.contact_phone,
              CustomerContactPerson.contact_job_role,
            ],
          };

        }
        const customerContactPersonResult = await client.query(saveCustomerContactPersonQuery.text, saveCustomerContactPersonQuery.values);

        if (customerContactPersonResult.rowCount !== 1) {
          throw new Error('Failed to insert customer contact person');
        }

        // Commit the transaction if all operations are successful
        await client.query('COMMIT');

        response = {
          status: 'success',
          id: content.customerid,
          ...customerResult.rows[0],
          ...customerBillingAddressResult.rows[0],
          ...CustomerShippingAddressResult.rowCount,
          ...customerContactPersonResult.rowCount,
          // ...customerBillingAddressResult.rows[0],
          // ...CustomerShippingAddressResult.rows[0],
          // ...customerContactPersonResult.rows[0],


        };

        return response;
      } catch  (error) {

        await client.query('ROLLBACK');
        const response ={
          code: 200,
          status:'success',
          data: customerResult?.rows[0] || null,
        };
        return response;
        // throw error;
      } finally {
        client.release();
      }
    },
  },

  Customer: {
    billing_address: async (parent, _, { db }) => {
      try {
        const query = {
          text: `SELECT location, state, city, country, zipcode, isdefault FROM customerbillingaddresses WHERE customerid = $1 `,
          values: [parent.customerid],
        };
        const result = await db.query(query.text, query.values);

        console.log('Billing Address Result:', result.rows); 

        return [result.rows[0]];
      } catch (error) {
        
        console.error('Billing Address Resolver Error:', error);

        throw new Error("Failed to retrieve billing address");
      }
    },
    shipping_address: async (parent, _, { db }) => {
      try {
        const query = {
          text: `SELECT location, city, state, country FROM customershippingaddresses WHERE customerid = $1 `,
          values: [parent.customerid],
        };
        const result = await db.query(query.text, query.values);
        return result.rows[0];
      } catch (error) {
        throw new Error("Failed to retrieve shipping address");
      }
    },
    customer_contact_person: async (parent, _, { db }) => {
      try {
        const query = {
          text: `SELECT cpfirstname, cplastname, cpemail, cpcontact, cpjobrole FROM customercontactperson WHERE customerid = $1`,
          values: [parent.customerid],
        };
        const result = await db.query(query.text, query.values);
        return result.rows[0];
      } catch (error) {
        throw new Error("Failed to retrieve customer contact person");
      }
    },
  },
};

module.exports = resolvers;
