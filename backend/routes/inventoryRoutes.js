const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

router.get('/items', inventoryController.getItems);
router.post('/items', inventoryController.addItem);

module.exports = router;

