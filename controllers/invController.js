const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

// error trigger
invCont.triggerError = (req, res, next) => {
  const error = new Error("This is a forced error to test error handling.");
  error.status = 500;
  next(error); // Pass error to the next middleware
};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classification_id;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data.length > 0 ? data[0].classification_name : "No vehicles found";
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Build vehicle details view
 * ************************** */
invCont.buildByVehicleId = async function (req, res, next) {
  try {
    const inv_id = req.params.inv_id;
    const data = await invModel.getVehicleById(inv_id);
    let nav = await utilities.getNav();

    if (!data) {
      res.status(404).render("errors/error", {
        title: "Vehicle Not Found",
        message: "Sorry, we couldn't find that vehicle.",
        nav,
        errors: null,
      });
      return;
    }

    res.render("./inventory/vehicle-detail", {
      title: `${data.inv_make} ${data.inv_model}`,
      nav,
      vehicle: data,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Build vehicle management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  try {
    if (req.session.account_type !== 'Admin' && req.session.account_type !== 'Employee') {
      req.flash("error", "You must be logged in as an Admin or Employee to access this page.");
      return res.redirect("./account/login");
    }

    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();
    res.render("./inventory/manage", {
      title: "Vehicle Management",
      nav,
      errors: null,
      classificationSelect,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async (req, res, next) => {
  try {
    let nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  try {
    const classifications = await invModel.getClassifications();
    let nav = await utilities.getNav();
    res.render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      classifications: classifications.rows,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

// Process Add classification
invCont.addClassification = async (req, res, next) => {
  try {
    const { classification_name } = req.body;

    // Ensure input is provided
    if (!classification_name || classification_name.trim() === "") {
      req.flash("error", "Classification name is required.");
      return res.redirect("/inv/add-classification");
    }

    // Insert into database
    const newClassification = await invModel.addClassification(classification_name.trim());

    if (newClassification) {
      req.flash("success", "New classification added successfully.");
      return res.redirect("/inv");
    } else {
      req.flash("error", "Database insertion failed.");
      return res.redirect("/inv/add-classification");
    }
  } catch (error) {
    console.error("Error adding classification:", error);
    req.flash("error", "An error occurred while adding classification.");
    return res.redirect("/inv/add-classification");
  }
};

// Process add new vehicle
invCont.addInventory = async (req, res, next) => {
  try {
    const {
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body;

    // Validate required fields
    if (!inv_make || !inv_model || !inv_year || !inv_price || !classification_id) {
      req.flash("error", "All required fields must be filled.");
      return res.redirect("/inventory/add-inventory");
    }

    // Ensure year is a valid number
    if (isNaN(inv_year) || inv_year < 1886 || inv_year > new Date().getFullYear()) {
      req.flash("error", "Invalid vehicle year.");
      return res.redirect("/inv/add-inventory");
    }

    // Ensure price is a number
    if (isNaN(inv_price) || inv_price <= 0) {
      req.flash("error", "Price must be a valid number.");
      return res.redirect("/inv/add-inventory");
    }

    // Insert into database
    const newVehicle = await invModel.addVehicle({
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });

    if (newVehicle) {
      req.flash("success", "New vehicle added successfully.");
      return res.redirect("/inv");
    } else {
      req.flash("error", "Failed to add vehicle.");
      return res.redirect("/inv/add-inventory");
    }
  } catch (error) {
    console.error("Error adding vehicle:", error);
    req.flash("error", "An error occurred while adding the vehicle.");
    return res.redirect("/inv/add-inventory");
  }
};

// Return Inventory by Classification as JSON
invCont.getInventoryJSON = async (req, res, next) => {
  try {
    const classification_id = parseInt(req.params.classification_id);
    const invData = await invModel.getInventoryByClassificationId(classification_id);
    if (invData[0].inv_id) {
      return res.json(invData);
    } else {
      next(new Error("No data returned"));
    }
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Build edit/update a vehicle info
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id);
    let nav = await utilities.getNav();
    const itemData = await invModel.getInventoryById(inv_id);
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id);
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
    res.render("./inventory/edit-vehicle", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id,
    });
  } catch (error) {
    next(error);
  }
};

// Update inventory item
invCont.updateInventoryItem = async (req, res, next) => {
  try {
    const {
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body;

    // Validate required fields
    if (!inv_id || !inv_make || !inv_model || !inv_year || !inv_price || !classification_id) {
      req.flash("error", "All required fields must be filled.");
      return res.redirect(`/inventory/edit-vehicle/${inv_id}`);
    }

    // Ensure year is a valid number
    if (isNaN(inv_year) || inv_year < 1886 || inv_year > new Date().getFullYear()) {
      req.flash("error", "Invalid vehicle year.");
      return res.redirect(`/inventory/edit-vehicle/${inv_id}`);
    }

    // Ensure price is a number
    if (isNaN(inv_price) || inv_price <= 0) {
      req.flash("error", "Price must be a valid number.");
      return res.redirect(`/inventory/edit-vehicle/${inv_id}`);
    }

    // Update in database
    const updatedVehicle = await invModel.updateVehicle({
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });

    if (updatedVehicle) {
      req.flash("success", "Vehicle updated successfully.");
      return res.redirect("/inventory");
    } else {
      req.flash("error", "Failed to update vehicle.");
      return res.redirect(`/inventory/edit-vehicle/${inv_id}`);
    }
  } catch (error) {
    console.error("Error updating vehicle:", error);
    req.flash("error", "An error occurred while updating the vehicle.");
    return res.redirect(`/inventory/edit-vehicle/${inv_id}`);
  }
};

/* ***************************
 *  Build delete confirmation view
 * ************************** */
invCont.buildDeleteConfirmation = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id);
    let nav = await utilities.getNav();
    const itemData = await invModel.getInventoryById(inv_id);
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
    res.render("./inventory/delete-confirmation", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id,
    });
  } catch (error) {
    next(error);
  }
};

// Delete inventory item
invCont.deleteInventoryItem = async (req, res, next) => {
  try {
    const inv_id = parseInt(req.body.inv_id);

    // Delete from database
    const deleteResult = await invModel.deleteVehicle(inv_id);

    if (deleteResult) {
      req.flash("success", "Vehicle deleted successfully.");
      return res.redirect("/inventory");
    } else {
      req.flash("error", "Failed to delete vehicle.");
      return res.redirect(`/inventory/delete-cofirm/${inv_id}`);
    }
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    req.flash("error", "An error occurred while deleting the vehicle.");
    return res.redirect(`/inventory/delete-confirm/${inv_id}`);
  }
};

module.exports = invCont;