const { db } = require("../../db/index");


const resolver = {
    Query: {
        getSalesOrder: async (_, { db }) => {
            try {
                const query = {
                    text: `
                    SELECT
                        sales_order.sales_order_id,
                        sales_order.customerid,
                        sales_order.display_name,
                        sales_order.sales_description,
                        sales_order.order_date,
                        sales_order.expected_date,
                        sales_order.currency,
                        sales_order.amount,
                        sales_order.total_discount,
                        sales_order.payment_due,
                        sales_order.userid,
                        ARRAY_AGG(DISTINCT JSONB_BUILD_OBJECT(
                          'Item_ID', sales_item.item_id,
                          'Item_Name', sales_item.item_name,
                          'Sold_Quantity', sales_item.sold_quantity,
                          'Item_Price', sales_item.item_price,
                          'Item_Discount', sales_item.item_discount
                          )) AS sales_item
                              FROM
                              sales_order
                              LEFT JOIN sales_item ON sales_order.sales_order_id = sales_item.sales_order_id
                              where sales_order.sales_order_id = $1
                              GROUP BY
                                sales_order.sales_order_id,
                                sales_order.customerid,
                                sales_order.display_name,
                                sales_order.sales_description,
                                sales_order.order_date,
                                sales_order.expected_date,
                                sales_order.currency,
                                sales_order.amount,
                                sales_order.total_discount,
                                sales_order.payment_due,
                                sales_order.userid;
                    `,
                    value: [id],
                };

                const result = await db.query(query.text, query.values);
                console.log("Result in Sales Order resolver -------- ", JSON.stringify(result.rows));
                console.log("ID in Sales Order resolver --------------", id);

                if (result.rowCount > 0) {
                    const response = {
                        code: 200,
                        status: 'success',
                        data: result.rows[0],
                    };
                    console.log(response.data.vendor_billing_address[0]);
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
                    data: error,
                };
                return response;
            }

        },

        getSalesOrders: async () => {
            try {
                const query = {
                    text: `
                        SELECT
                            sales_order.sales_order_id,
                            sales_order.customerid,
                            sales_order.display_name,
                            sales_order.sales_description,
                            sales_order.order_date,
                            sales_order.expected_date,
                            sales_order.currency,
                            sales_order.amount,
                            sales_order.total_discount,
                            sales_order.payment_due,
                            sales_order.userid,
                            ARRAY_AGG(DISTINCT JSONB_BUILD_OBJECT(
                              'item_id', sales_item.item_id,
                              'item_name', sales_item.item_name,
                              'sold_quantity', sales_item.sold_quantity,
                              'item_price', sales_item.item_price,
                              'item_discount', sales_item.item_discount
                            )) AS sales_items
                        FROM
                            sales_order
                        LEFT JOIN sales_item ON sales_order.sales_order_id = sales_item.sales_order_id
                        GROUP BY
                            sales_order.sales_order_id,
                            sales_order.customerid,
                            sales_order.display_name,
                            sales_order.sales_description,
                            sales_order.order_date,
                            sales_order.expected_date,
                            sales_order.currency,
                            sales_order.amount,
                            sales_order.total_discount,
                            sales_order.payment_due,
                            sales_order.userid;
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
        saveSalesOrder: async (_, { input }) => {
            const client = await db.connect();
            console.log("connection build on Sales Order Resolver");
            console.log("Content in Sales Order Resolver:  ", input);
            let salesOrderResult;
            let salesItemResult;
            let response;
            // let savedResult;
            try {
                await client.query('BEGIN');

                const saveSalesOrderQuery = {
                    text: `
                      INSERT INTO purchase_order (
                        purchase_order_id,
                        vendor_id,
                        vendor_name,
                        purchase_description,
                        order_date,
                        expected_date,
                        currency,
                        amount,
                        total_discount,
                        payment_due,
                        userid,
                      )
                      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                      RETURNING *;
                    `,
                    values: [
                        input.purchase_order_id,
                        input.vendor_id,
                        input.vendor_name,
                        input.purchase_description,
                        input.order_date,
                        input.expected_date,
                        input.currency,
                        input.amount,
                        input.total_discount,
                        input.payment_due,  // <-- add a comma here
                        input.userid,
                    ],

                };

                salesOrderResult = await db.query(saveSalesOrderQuery.text, saveSalesOrderQuery.values);

                if (salesOrderResult === 0) {
                    throw new Error("Failed to Insert Sales Order");
                }

                //Save Sales Items

                const SalesItems = input.sales_items;//                const SalesItems = input.quantity;
                for (const SalesItem of SalesItems) {
                    const saveSalesItemQuery = {
                        text: `
                        INSERT INTO sales_item(
                            sales_order_id,
	                        item_id,
	                        item_name,
	                        sold_quantity,
	                        item_price,
	                        item_discount
                        )
                        VALUES(
                            $1, $2, $3, $4, $5, $6
                        )RETURNING*;
                        `,
                        values: [
                            input.sales_order_id,
                            SalesItem.item_id,
                            SalesItem.item_name,
                            SalesItem.sold_quantity,
                            SalesItem.item_price,
                            SalesItem.item_discount,
                        ],
                    };
                    salesItemResult = await client.query(saveSalesItemQuery.text, saveSalesItemQuery.values);

                    if (salesItemResult === 0) {
                        throw new Error("Failed To Insert Into Sales Item");
                    }
                };

                response = {
                    code: 200,
                    status: 'Success',
                    savedResult: salesOrderResult, salesItemResult
                };

                //Commit the transection if everything is successful
                await client.query('COMMIT');
                console.log("Transaction Successful")
                return response;
            } catch (error) {
                console.log(error);
                await client.query('ROLLBACK');
                response = {
                    code: 500,
                    status: 'error',
                    data: error,
                    error: error.message,
                };
                return response;
            } finally {
                client.release();
            }
        },
    },
    SalesOrder: {
        sales_item: async (parent, _, { db }) => {
            try {
                const query = {
                    text: `SELECT sales_order_id, item_id, item_name, sold_quantity, item_price, item_discount FROM sales_item WHERE sales_order_id =$1`,
                    values: [parent.sales_order_id],
                };
                const result = await db.query(query.text, query.values);

                console.log("Sales Item Result:".result.rows);
                return result.rows[0];
            } catch (error) {
                console.log("Sales Order Resolver Error:", error);
                throw new Error("Failed To Retrieve Sales Items");
            }
        },
    },
};
module.exports = resolver;