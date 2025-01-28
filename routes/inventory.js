const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Route for vehicle detail
router.get('/vehicle/:id', inventoryController.getVehicleDetail);

// Routes for each vehicle category
router.get('/custom', inventoryController.getVehiclesByCategory('custom'));
router.get('/sedan', inventoryController.getVehiclesByCategory('sedan'));
router.get('/suv', inventoryController.getVehiclesByCategory('suv'));
router.get('/sport', inventoryController.getVehiclesByCategory('sport'));
router.get('/truck', inventoryController.getVehiclesByCategory('truck'));

module.exports = router;