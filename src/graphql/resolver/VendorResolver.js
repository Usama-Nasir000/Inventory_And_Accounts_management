// const { error } = require("console");
const { db } = require("../../db/index");

const resolvers = {
  Query: {
    getVendor: async (_, { id }) => {
      try {
        const query = {
          text: `
          SELECT 
          Vendor.UserID,
          Vendor.VendorID,
          Vendor.category,
          Vendor.company_name,
          Vendor.Email,
          Vendor.main_phone,
          Vendor.work_phone,
          Vendor.first_name,
          Vendor.middle_name,
          Vendor.last_name,
          Vendor.display_name,
          Vendor.Website,
          Vendor.Amount,
          Vendor.Currency,
          Vendor.payment_terms,
          ARRAY_AGG(DISTINCT JSONB_BUILD_OBJECT(
          'location', vendor_billing_address.location,
          'state', vendor_billing_address.State,
          'city', vendor_billing_address.City,
          'country', vendor_billing_address.Country,
          'zipcode', vendor_billing_address.ZipCode,
          'isdefault', vendor_billing_address.IsDefault
          )) AS vendor_billing_address,
              ARRAY_AGG(DISTINCT JSONB_BUILD_OBJECT(
                  'location', Vendor_Shipping_Addresses.location,
                  'state', Vendor_Shipping_Addresses.State,
                  'city', Vendor_Shipping_Addresses.City,
                  'country', Vendor_Shipping_Addresses.Country,
                  'zipcode', Vendor_Shipping_Addresses.ZipCode,
                  'isdefault', Vendor_Shipping_Addresses.IsDefault
                  )) AS Vendor_Shipping_Addresses,
                  ARRAY_AGG(DISTINCT JSONB_BUILD_OBJECT(
                      'cpfirstname', Vendor_Contact_Person.CPFirstName,
                      'cplastname', Vendor_Contact_Person.CPLastName,
                      'cpemail', Vendor_Contact_Person.CPEmail,
                      'cpcontact', Vendor_Contact_Person.CPcontact,
                      'cpjobrole', Vendor_Contact_Person.CPJobRole
                      )) AS Vendor_Contact_Person
                      FROM Vendor
                      LEFT JOIN vendor_billing_address ON Vendor.VendorID = vendor_billing_address.VendorID
                      LEFT JOIN Vendor_Shipping_Addresses ON Vendor.VendorID = Vendor_Shipping_Addresses.VendorID
                      LEFT JOIN Vendor_Contact_Person ON Vendor.VendorID = Vendor_Contact_Person.VendorID
                      WHERE Vendor.VendorID = $1
                      GROUP BY 
                      Vendor.UserID,
                      Vendor.VendorID,
                      Vendor.category,
                      Vendor.company_name,
                      Vendor.Email,
                      Vendor.main_phone,
                      Vendor.work_phone,
                      Vendor.first_name,
                      Vendor.middle_name,
                      Vendor.last_name,
                      Vendor.display_name,
                      Vendor.Website,
                      Vendor.Amount,
                      Vendor.Currency,
                      Vendor.payment_terms;
                `,
          values: [id],
        };

        const result = await db.query(query.text, query.values);
        console.log("Result in Vendor resolver -------- ", JSON.stringify(result.rows));
        console.log("ID in Vendor resolver --------------", id);

        if (result.rowCount > 0) {
          const response = {
            code: 200,
            status: 'success',
            count: result.rowCount,
            data: result.rows[0],
          };
          console.log(response);
          // console.log(response.data.vendor_billing_address[0]);
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
        console.log('Error in getVendor resolver:',error);
        const response = {
          code: 500,
          status: 'error',
          data: null,
          error: error.message,
        };
        return response;
      }
    },

    getVendors: async () => {
      try {
        const query = {
          // SELECT * from vendor
          text: `
          SELECT 
          Vendor.UserID,
          Vendor.VendorID,
          Vendor.category,
          Vendor.company_name,
          Vendor.Email,
          Vendor.main_phone,
          Vendor.work_phone,
          Vendor.first_name,
          Vendor.middle_name,
          Vendor.last_name,
          Vendor.display_name,
          Vendor.Website,
          Vendor.Amount,
          Vendor.Currency,
          Vendor.payment_terms,
          ARRAY_AGG(DISTINCT JSONB_BUILD_OBJECT(
            'location', vendor_billing_address.location,
            'state', vendor_billing_address.State,
            'city', vendor_billing_address.City,
            'country', vendor_billing_address.Country,
            'zipcode', vendor_billing_address.ZipCode,
            'isdefault', vendor_billing_address.IsDefault
          )) AS vendor_billing_address,
              ARRAY_AGG(DISTINCT JSONB_BUILD_OBJECT(
                  'location', vendor_shipping_addresses.location,
                  'state', vendor_shipping_addresses.State,
                  'city', vendor_shipping_addresses.City,
                  'country', vendor_shipping_addresses.Country,
                  'zipcode', vendor_shipping_addresses.ZipCode,
                  'isdefault', vendor_shipping_addresses.IsDefault
                  )) AS vendor_shipping_addresses,
                  ARRAY_AGG(DISTINCT JSONB_BUILD_OBJECT(
                      'cpfirstname', Vendor_Contact_Person.CPFirstName,
                      'cplastname', Vendor_Contact_Person.CPLastName,
                      'cpemail', Vendor_Contact_Person.CPEmail,
                      'cpcontact', Vendor_Contact_Person.CPcontact,
                      'cpjobrole', Vendor_Contact_Person.CPJobRole
                      )) AS Vendor_Contact_Person
                      FROM Vendor
                      LEFT JOIN vendor_billing_address ON Vendor.VendorID = vendor_billing_address.VendorID
                      LEFT JOIN vendor_shipping_addresses ON Vendor.VendorID = vendor_shipping_addresses.VendorID
                      LEFT JOIN Vendor_Contact_Person ON Vendor.VendorID = Vendor_Contact_Person.VendorID
                      GROUP BY 
                      Vendor.UserID,
                      Vendor.VendorID,
                      Vendor.category,
                      Vendor.company_name,
                      Vendor.Email,
                      Vendor.main_phone,
                      Vendor.work_phone,
                      Vendor.first_name,
                      Vendor.middle_name,
                      Vendor.last_name,
                      Vendor.display_name,
                      Vendor.Website,
                      Vendor.Amount,
                      Vendor.Currency,
                      Vendor.payment_terms;
                      `,
        };

        const result = await db.query(query.text);
        console.log(result.rows);
        console.log("Result in Vendor resolver -------- ", JSON.stringify(result.rows));
        console.log("ID in vendor resolver --------------", result.id);

        if (result.rowCount > 0) {
          const response = {
            code: 200,
            status: 'success',
            count: result.rowCount,
            data: result.rows,
          };
          console.log(response);

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
      let input = content.input
      const client = await db.connect();
      console.log("connection build on vendor resolver");
      console.log("Content in vendorResolver:  ", input);
      let response;
      let vendorResult;
      let vendorBillingAddressResult;
      let vendorShippingAddressResult;
      let vendorContactPersonResult;
      
      try {
        await client.query('BEGIN');
  
        const saveVendorQuery = {
          text: `
            INSERT INTO Vendor (
              userid,
              vendorid,
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
            input.vendorid,
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
  
        vendorResult = await client.query(saveVendorQuery.text, saveVendorQuery.values);
  
        if (vendorResult.rowCount !== 1) {
          throw new Error('Failed to insert vendor');
        }

        // Save vendor_billing_address
        const billingAddresses = input.vendor_billing_address;
        for (const billingAddress of billingAddresses ) {
        const saveBillingAddressQuery = {
          text: `
            INSERT INTO vendor_billing_address (
              vendorid,
              location,
              state,
              city,
              country,
              zipcode,
              isdefault
            )
            VALUES (
              $1, $2, $3, $4, $5, $6, $7
            )
            RETURNING *;
          `,
          values: [
            input.vendorid,
            billingAddress.location,
            billingAddress.state,
            billingAddress.city,
            billingAddress.country,
            billingAddress.zipcode,
            billingAddress.isdefault,
          ],
        };
  
        vendorBillingAddressResult = await client.query(saveBillingAddressQuery.text, saveBillingAddressQuery.values);
  
        if (vendorBillingAddressResult.rowCount !== 1) {
          throw new Error('Failed to insert Vendor Billing Address');
        }
      };

        // Save VendorShippingAddresses
        const shippingAddresses = input.vendor_shipping_addresses;
        for (const shippingAddress of shippingAddresses){
        const saveShippingAddressQuery = {
          text: `
            INSERT INTO Vendor_Shipping_Addresses (
              VendorID,
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
            input.vendorid,
            shippingAddress.location,
            shippingAddress.state,
            shippingAddress.city,
            shippingAddress.country,
            shippingAddress.zipcode,
            shippingAddress.isdefault,
          ],
        };
  
        vendorShippingAddressResult = await client.query(saveShippingAddressQuery.text, saveShippingAddressQuery.values);
  
        if (vendorShippingAddressResult.rowCount !== 1) {
          throw new Error('Failed to insert Vendor Shipping Address');
        }
      };


        // Save VendorContactPerson
        const contactPersons = input.vendor_contact_person;
        for (const contactPerson of contactPersons){
          const saveContactPersonQuery = {
            text: `
              INSERT INTO Vendor_Contact_Person (
                VendorID,
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
              input.vendorid,
              contactPerson.cpfirstname,
              contactPerson.cplastname,
              contactPerson.cpemail,
              contactPerson.cpcontact,
              contactPerson.cpjobrole,
            ],
          };
  
          vendorContactPersonResult = await client.query(saveContactPersonQuery.text, saveContactPersonQuery.values);
  
          if (vendorContactPersonResult.rowCount !== 1) {
            throw new Error('Failed To Insert Vendor Contact Person')
          }
        };

        response = {
          code: 200,
          status: 'success',
          id: input.vendorid,
          data: {
            vendor: vendorResult.rows[0], 
            billingAddresses: vendorBillingAddressResult.rows,
            shippingAddresses: vendorShippingAddressResult.rows,
            contactPersons: vendorContactPersonResult.rows,  
          },
        };

      console.log(response.data);

        // Commit the transaction if everything is successful
        await client.query('COMMIT');

        console.log("Transaction Successful")
        return response;
      }catch (error) {
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
        client.release();
      }
    },
  },

  Vendor: {
    vendor_billing_address: async (parent, _, { db }) => {
      try {
        const query = {
          text: `SELECT location, state, city, country, zipcode, isdefault FROM vendor_billing_address WHERE vendorid = $1 `,
          values: [parent.vendorid],
        };
        const result = await db.query(query.text, query.values);

        console.log('Billing Address Result:', result.rows);

        return result.rows;
      } catch (error) {

        console.error('Billing Address Resolver Error:', error);

        throw new Error("Failed to retrieve billing address");
      }
    },
    Vendor_Shipping_Addresses: async (parent, _, { db }) => {
      try {
        const query = {
          text: `SELECT location, state, city, country, zipcode, isdefault FROM vendor_shipping_addresses WHERE vendorid = $1 `,
          values: [parent.vendorid],
        };
        const result = await db.query(query.text, query.values);
        console.log('Shipping Addresses Result:', result.rows); 
        return result.rows;
      } catch (error) {
        console.error('Shipping Addresses Resolver Error:', error);
        throw new Error("Failed to retrieve shipping address");
      }
    },
    Vendor_Contact_Person: async (parent, _, { db }) => {
      try {
        const query = {
          text: `SELECT cpfirstname, cplastname, cpemail, cpcontact, cpjobrole FROM vendor_contact_person WHERE vendorid = $1`,
          values: [parent.vendorid],
        };
        const result = await db.query(query.text, query.values);
        return result.rows;
      } catch (error) {
        throw new Error("Failed to retrieve vendor contact person");
      }
    },
  },
};
module.exports = resolvers;

