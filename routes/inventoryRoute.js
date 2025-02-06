// Needed Resources 
const express = require("express");
const router = new express.Router() ;
const invController = require("../controllers/invController");
const utilities = require("../utilities");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build vehicle details view
router.get("/detail/:vehicleId", invController.buildByVehicleId);

// Route to build inv/index view
router.get("/", invController.buildInventoryIndex);

// Route to build add classification view
router.get("/add-classification", invController.buildAddClassification);

// Process Add Classification Form
router.post("/add-classification", utilities.handleErrors(invController.addClassification));

//Route to build add vehicle view
router.get("/add-inventory", invController.buildAddInventory);

// Process Add Inventory Form
router.post("/add-inventory", utilities.handleErrors(invController.addInventory))

// Intentional error route to trigger 500 error
router.get("/error", invController.triggerError);

// Error handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = router;