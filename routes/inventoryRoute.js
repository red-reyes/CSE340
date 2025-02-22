// Needed Resources 
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");

// Route to build inventory by classification view
router.get("/type/:classification_id", invController.buildByClassificationId);

// Route to build vehicle details view
router.get("/detail/:inv_id", invController.buildByVehicleId);

// Route to build inv/manage view
router.get("/", invController.buildManagementView);

// Route to build add classification view
router.get("/add-classification", utilities.checkJWTToken, utilities.checkAccountType, invController.buildAddClassification);

// Process Add Classification Form
router.post("/add-classification", utilities.checkJWTToken, utilities.checkAccountType, utilities.handleErrors(invController.addClassification));

// Route to build add vehicle view
router.get("/add-inventory", utilities.checkJWTToken, utilities.checkAccountType, invController.buildAddInventory);

// Process Add Inventory Form
router.post("/add-inventory", utilities.checkJWTToken, utilities.checkAccountType, utilities.handleErrors(invController.addInventory));

// Unite 5 Selec inv item activity
router.get("/getInventory/:classification_id", utilities.checkJWTToken, utilities.checkAccountType, utilities.handleErrors(invController.getInventoryJSON));

// Route to get item id to edit
router.get("/edit-vehicle/:inv_id", utilities.checkJWTToken, utilities.checkAccountType, utilities.handleErrors(invController.editInventoryView));

// Process Edit Inventory Item Form
router.post("/inv/:inv_id", utilities.checkJWTToken, utilities.checkAccountType, utilities.handleErrors(invController.editInventoryView));

// Route to build delete confirmation view
router.get("/delete-confirm/:inv_d", utilities.checkJWTToken, utilities.checkAccountType, utilities.handleErrors(invController.builddeleteInventoryItem));

// Intentional error route to trigger 500 error
router.get("/error", invController.triggerError);

// Error handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = router;