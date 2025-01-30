// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build vehicle details view
router.get("/detail/:vehicleId", invController.buildByVehicleId);

// Intentional error route to trigger 500 error
router.get("/error", invController.triggerError);


module.exports = router;