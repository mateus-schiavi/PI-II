const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// GET: Obter todos os itens
router.get('/items', inventoryController.getItems);

// POST: Adicionar um novo item
router.post('/items', inventoryController.addItem);

// PUT: Atualizar um item existente
router.put('/items/:id', inventoryController.updateItem); 

// DELETE: Deletar um item existente
router.delete('/items/:id', inventoryController.deleteItem); 

module.exports = router;

