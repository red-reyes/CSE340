// Needed Resources 
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build vehicle details view
router.get("/detail/:vehicleId", invController.buildByVehicleId);

// Route to build inv/index view
router.get("/", invController.buildManagementView);

// Route to build add classification view
router.get("/add-classification", invController.buildAddClassification);

// Process Add Classification Form
router.post("/add-classification", utilities.handleErrors(invController.addClassification));

// Route to build add vehicle view
router.get("/add-inventory", invController.buildAddInventory);

// Process Add Inventory Form
router.post("/add-inventory", utilities.handleErrors(invController.addInventory));

// Unite 5 Selec inv item activity
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

// Route to get item id to edit
router.get("/edit/:itemId", utilities.handleErrors(invController.editInventoryItem));

// Process Edit Inventory Item Form
router.post("/edit/:itemId", utilities.handleErrors(invController.editInventoryItem));

// Process Update Inventory Item Form
router.post("/update/:itemId", utilities.handleErrors(invController.updateInventoryItem));

// Route to build delete confirmation view
router.get("/delete-confirm/:itemId", utilities.handleErrors(invController.builddeleteInventoryItem));

// Intentional error route to trigger 500 error
router.get("/error", invController.triggerError);

// Error handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = router;


// // Needed Resources 
// const express = require("express");
// const router = new express.Router();
// const invController = require("../controllers/invController");
// const utilities = require("../utilities");

// // Route to build inventory by classification view
// router.get("/type/:classificationId", invController.buildByClassificationId);

// // Route to build vehicle details view
// router.get("/detail/:vehicleId", invController.buildByVehicleId);

// // Route to build inv/index view
// router.get("/", invController.buildManagementView);

// // Route to build add classification view
// router.get("/add-classification", utilities.checkJWTToken, utilities.checkAccountType, invController.buildAddClassification);

// // Process Add Classification Form
// router.post("/add-classification", utilities.checkJWTToken, utilities.checkAccountType, utilities.handleErrors(invController.addClassification));

// // Route to build add vehicle view
// router.get("/add-inventory", utilities.checkJWTToken, utilities.checkAccountType, invController.buildAddInventory);

// // Process Add Inventory Form
// router.post("/add-inventory", utilities.checkJWTToken, utilities.checkAccountType, utilities.handleErrors(invController.addInventory));

// // Unite 5 Selec inv item activity
// router.get("/getInventory/:classification_id", utilities.checkJWTToken, utilities.checkAccountType, utilities.handleErrors(invController.getInventoryJSON));

// // Route to get item id to edit
// router.get("/edit/:itemId", utilities.checkJWTToken, utilities.checkAccountType, utilities.handleErrors(invController.editInventoryItem));

// // Process Edit Inventory Item Form
// router.post("/edit/:itemId", utilities.checkJWTToken, utilities.checkAccountType, utilities.handleErrors(invController.editInventoryItem));

// // Process Update Inventory Item Form
// router.post("/update/:itemId", utilities.checkJWTToken, utilities.checkAccountType, utilities.handleErrors(invController.updateInventoryItem));

// // Route to build delete confirmation view
// router.get("/delete-confirm/:itemId", utilities.checkJWTToken, utilities.checkAccountType, utilities.handleErrors(invController.builddeleteInventoryItem));

// // Intentional error route to trigger 500 error
// router.get("/error", invController.triggerError);

// // Error handling middleware
// router.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something broke!');
// });

// module.exports = router;

/*

*/ 