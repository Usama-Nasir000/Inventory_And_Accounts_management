// itemController.js
const {db} = require('../db/index',);
const path = require('path');
const fs = require('fs');
// const asd =require ('../images/item-images')


// Create
const createItem = async (item) => {
  const {
    userid,
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
    currency,
  } = item;

  const query = {
    text: `
      INSERT INTO item (
        userid, item_image, item_name, item_code, category, status, 
        purchase_price, sales_price, stock_quantity, income_account, 
        cogs_account, inventory_account, currency
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *;
    `,
    values: [
      userid,
      `images/item-images/${item_image}`,
      //`item-images/${item_image}`,
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
      currency,
    ],
  };

  try {
    const result = await db.query(query.text, query.values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Read
const getAllItems = async () => {
  const query = 'SELECT * FROM item';

  try {
    const result = await db.query(query);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

const getItemById = async (itemId) => {
  const query = {
    text: 'SELECT * FROM item WHERE itemid = $1',
    values: [itemId],
  };

  try {
    const result = await db.query(query);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Update
const updateItem = async (itemId, updatedItem) => {
  try {
    // Validate if itemId is provided
    if (!itemId) {
      throw new Error('Item ID is required for updating an item.');
    }

    // Validate if the item with the given ID exists
    const existingItem = await getItemById(itemId);
    if (!existingItem) {
      throw new Error('Item not found.');
    }

    // Extract only the fields that are allowed to be updated
    const allowedFields = [
      'item_image',
      'item_name',
      'item_code',
      'category',
      'status',
      'purchase_price',
      'sales_price',
      'stock_quantity',
      'income_account',
      'cogs_account',
      'inventory_account',
      'currency',
    ];

    const updatedFields = {};
    allowedFields.forEach((field) => {
      if (updatedItem[field] !== undefined) {
        updatedFields[field] = updatedItem[field];
      }
    });

    // If the updatedItem includes an image, update the image path
    if (updatedFields.item_image) {
      updatedFields.item_image = `images/item-images/${updatedFields.item_image}`;
    }

    // Construct the SET clause for the update query
    const setClause = Object.keys(updatedFields)
      .map((field, index) => `${field} = $${index + 1}`)
      .join(', ');

    // Update query
    const updateQuery = {
      text: `
        UPDATE item
        SET ${setClause}
        WHERE itemid = $${allowedFields.length + 1}
        RETURNING *;
      `,
      values: [...Object.values(updatedFields), itemId],
    };

    // Execute the update query
    const result = await db.query(updateQuery.text, updateQuery.values);

    // Return the updated item
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};


// Delete
const deleteItem = async (itemId) => {
  try {
    // Validate if itemId is provided
    if (itemId == null) {
      throw new Error('Item ID is required for deleting an item.');
    }

    // Validate if the item with the given ID exists
    const existingItem = await getItemById(itemId);
    if (!existingItem) {
      throw new Error('Item not found.');
    }

    // Delete query
    const deleteQuery = {
      text: 'DELETE FROM item WHERE itemid = $1 RETURNING *; ',
      values: [itemId],
    };

    // Execute the delete query
    const result = await db.query(deleteQuery.text, deleteQuery.values);

    if (existingItem && existingItem.item_image) {
      const imagePath = path.join(__dirname, '..', existingItem.item_image);
      fs.unlink(imagePath,(err)=>{
        if(err){
          console.log(err)
          throw (err)
        }
        else{
          return `Item with ID ${itemId} has been deleted successfully.`;
        }
      });
      // console.log(imagePath);
      // return imagePath;
    }
    // Return a message indicating successful deletion
    return `Item with ID ${itemId} has been deleted successfully.`;
  } catch (error) {
    throw error;
  }
};


module.exports = {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
};
