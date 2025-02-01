// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build vehicle details view
router.get("/detail/:vehicleId", invController.buildByVehicleId);

// Route to build inv/index view
router.get("/", invController.buildInventoryIndex);

// Route to build add classification view
router.get("/add-classification", invController.buildAddClassification);

//Route to build add vehicle view
router.get("/add-inventory", invController.buildAddInventory);

// Intentional error route to trigger 500 error
router.get("/error", invController.triggerError);


module.exports = router;