// routes.js
const express = require('express');
const multer  = require('multer');
const fs = require ('fs');
const path = require ('path');
const itemController = require('./itemController'); // Change the path based on your project structure

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,path.join(__dirname ,'../images/item-images'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]);
  }
});

const upload = multer({ storage: storage });

// Create
router.post('/create-item', upload.single('item_image'), async (req, res) => {
  console.log("req.body",req.body)
  try {
    if (Object.keys(req.body).length !== 0) {
      const newItem = await itemController.createItem({
        ...req.body,
        item_image: req.file.filename, 
      });
        res.send({
          code: 200,
          status: "Success",
          data: newItem,
        })
        console.log(newItem.item_image);
        console.log(__dirname);
        // res.status(201).json(newItem);
    }else{
      res.status(500).json({ error: 'Have null value' });
    }
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Read
router.get('/read-data', async (req, res) => {
  try {
    const items = await itemController.getAllItems();
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/read-data/:id', async (req, res) => {
  const id = req.params.id;
  const itemId = parseInt(id);
  try {
    const item = await itemController.getItemById(itemId);
    if (item) {
      res.status(200).json(item);
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    console.error('Error fetching item by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update
router.put('/update-item/:id',upload.single('item_image'), async (req, res) => {
  const id = req.params.id;
  const itemId = parseInt(id);
  const updatedItem = req.body;
  try {
    if (req.file) {
      updatedItem.item_image = req.file.filename;
    }
    await itemController.updateItem(itemId, updatedItem);
    res.status(200).json({ message: 'Item updated successfully' , updatedItem});
    console.log(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete
router.delete('/delete-item/:id', async (req, res) => {
  const id = req.params.id;
  const itemId = parseInt(id);
  try {
    await itemController.deleteItem(itemId);
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
