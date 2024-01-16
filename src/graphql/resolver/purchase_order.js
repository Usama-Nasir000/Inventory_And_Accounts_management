const { db } = require("../../db/index");


const resolver = {
    Query: {
        getPurchaseOrder: async (_, { id }) => {
            try {
                const query = {
                    text: `
                    SELECT 
                    	purchase_order.purchase_order_id,
                    	purchase_order.userid,
                    	purchase_order.vendor_id,
                    	purchase_order.vendor_name,
                    	purchase_order.purchase_description,
                    	purchase_order.order_date,
                    	purchase_order.expected_date,
                    	purchase_order.currency,
                    	purchase_order.amount,
                    	purchase_order.total_discount,
                    	purchase_order.payment_due,
                    	ARRAY_AGG(DISTINCT JSONB_BUILD_OBJECT(
                    		'item_id',purchase_items.item_id,
                    		'item_name',purchase_items.item_name,
                    		'purchase_quantity',purchase_items.purchase_quantity,
                    		'item_price',purchase_items.item_price,
                    		'item_discount',purchase_items.item_discount
                    		))AS purchase_items FROM purchase_order
                    		LEFT JOIN purchase_items ON purchase_order.purchase_order_id = purchase_items.purchase_order_id
                            WHERE purchase_order.purchase_order_id = $1
                    		GROUP BY 
                    				purchase_order.purchase_order_id,
                    				purchase_order.userid,
                    				purchase_order.vendor_id,
                    				purchase_order.vendor_name,
                    				purchase_order.purchase_description,
                    				purchase_order.order_date,
                    				purchase_order.expected_date,
                    				purchase_order.currency,
                    				purchase_order.amount,
                    				purchase_order.total_discount,
                    				purchase_order.payment_due;
                    `,
                    value:[id],
                };
                const result = await db.query(query.text,query.value);
                console.log("Result in Purchase Order resolver -------- ", JSON.stringify(result.rows));
                console.log("ID in Purchase Order resolver --------------", id);

                if (result.rowCount > 0) {
                    const response = {
                        code: 200,
                        status: 'success',
                        data: result.rows[0],
                    };
                    console.log(response.data);
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
        getPurchaseOrders: async()=>{
            try{
                const query = {
                    text: `
                    SELECT 
                    	purchase_order.purchase_order_id,
                    	purchase_order.userid,
                    	purchase_order.vendor_id,
                    	purchase_order.vendor_name,
                    	purchase_order.purchase_description,
                    	purchase_order.order_date,
                    	purchase_order.expected_date,
                    	purchase_order.currency,
                    	purchase_order.amount,
                    	purchase_order.total_discount,
                    	purchase_order.payment_due,
                    	ARRAY_AGG(DISTINCT JSONB_BUILD_OBJECT(
                    		'item_id',purchase_items.item_id,
                    		'item_name',purchase_items.item_name,
                    		'purchase_quantity',purchase_items.purchase_quantity,
                    		'item_price',purchase_items.item_price,
                    		'item_discount',purchase_items.item_discount
                    		))AS purchase_items FROM purchase_order
                    		LEFT JOIN purchase_items ON purchase_order.purchase_order_id = purchase_items.purchase_order_id
                    		GROUP BY 
                    				purchase_order.purchase_order_id,
                    				purchase_order.userid,
                    				purchase_order.vendor_id,
                    				purchase_order.vendor_name,
                    				purchase_order.purchase_description,
                    				purchase_order.order_date,
                    				purchase_order.expected_date,
                    				purchase_order.currency,
                    				purchase_order.amount,
                    				purchase_order.total_discount,
                    				purchase_order.payment_due;
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
        savePurchaseOrder: async (_,{input})=>{
            const client = await db.connect();
            console.log("connection build on Purchase Order Resolver");
            console.log("Content in Purchase Order Resolver:  ", input);
            let purchaseOrderResult;
            let purchaseItemsResult;
            let response;
            try{
                await client.query('BEGIN');

                const savePurchaseOrderQuery = {
                    text:`
                    INSERT into purchase_order(
                        userid,
                        purchase_order_id,
                        vendor_id,
                        vendor_name,
                        purchase_description,
                        order_date,
                        expected_date,
                        currency,
                        amount,
                        total_discount,
                        payment_due
                    ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *;
                    `,
                    values:[
                        input.userid,
                        input.purchase_order_id,
                        input.vendor_id,
                        input.vendor_name,
                        input.purchase_description,
                        input.order_date,
                        input.expected_date,
                        input.currency,
                        input.amount,
                        input.total_discount,
                        input.payment_due
                    ],
                };

                purchaseOrderResult = await client.query(savePurchaseOrderQuery.text,savePurchaseOrderQuery.values);

                if(purchaseOrderResult === 0){
                    throw new Error("Failed to Insert Purchase Order");
                }

                //save Purchase Order
                const PurchaseItems = input.purchase_items;
                for(const PurchaseItem of PurchaseItems){
                    const savePurchaseItemQuery = {
                        text:`
                        INSERT INTO purchase_items(
                            purchase_order_id,
                            item_id,
                            item_name,
                            purchase_quantity,
                            item_price,
                            item_discount
                        )
                        VALUES(
                            $1, $2, $3, $4, $5, $6
                        ) RETURNING *;
                        `,
                        values:[
                            input.purchase_order_id,
                            PurchaseItem.item_id,
                            PurchaseItem.item_name,
                            PurchaseItem.purchase_quantity,
                            PurchaseItem.item_price,
                            PurchaseItem.item_discount
                        ]
                    };
                    await client.query(savePurchaseItemQuery.text,savePurchaseItemQuery.values);
                    purchaseItemsResult = await client.query(`select * from purchase_items where purchase_order_id = ${input.purchase_order_id}`);
                    console.log("Purchase Order Result", purchaseItemsResult);

                    if(purchaseItemsResult === 0 ){
                        throw new Error("Failed To Inser Purchase Items")
                    }
                };

                response = {
                    code: 200,
                    status: 'Success',
                    id: input.purchase_order_id,
                    data:{
                        purchaseOrder:purchaseOrderResult.rows[0],
                        purchaseItems:purchaseItemsResult.rows
                    },
                    // savedResult: purchaseOrderResult, purchaseItemsResult
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
    PurchaseOrder:{
        purchase_items: async(parent,_,{db})=>{
            try{
                const query ={
                    text:`SELECT purchase_order_id, item_id, item_name, purchase_quantity, item_price, item_discount FROM purchase_items WHERE purchase_order_id = $1`,
                    value: [parent.purchase_order_id],
                };
                const result = await db.query(query.text,query.value);
                console.log("Purchase Item Result",result.rows);
                return result.rows[0];
            }catch(error){
                console.log("Sales Order Resolver Error:", error);
                throw new Error("Failed To Retrieve Sales Items");                
            }
        },
    },
};

module.exports = resolver;