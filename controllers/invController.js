const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

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
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
      errors: null,
    })
  } catch (error) {
    next(error)
  }
}

// vehicle details
invCont.buildByVehicleId = async function (req, res, next) {
  try {
    const vehicle_id = req.params.vehicleId;
    const data = await invModel.getVehicleById(vehicle_id);
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
      vehicle: data
    });
  } catch (error) {
    next(error)
  }
};

/* ***************************
 *  Build inv/index.js view
 * ************************** */
invCont.buildInventoryIndex = async (req, res, next) => {
  try {
    const data = await invModel.getAllInventory();
    let nav = await utilities.getNav();
    res.render("./inventory/index", {
      title: "Vehicle Management",
      nav,
      inventory: data,
      errors: null,
    });
  } catch (error) {
    next(error) 
  }
}

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
    next(error) 
  }
}

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async (req, res, next) => {
  try {
    let nav = await utilities.getNav();
    const classifications = await invModel.getClassifications();
    res.render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classifications,
      errors: null,
    });
  } catch (error) {
    next(error) 
  }
}

// Add classification
invCont.addClassification = async (req, res, next) => {
  try {
    const { classification_name } = req.body;

    // Ensure input is provided
    if (!classification_name || classification_name.trim() === "") {
      req.flash("error", "Classification name is required.");
      return res.redirect("/inventory/add-classification");
    }

    // Insert into database
    const newClassification = await invModel.addClassification(classification_name.trim());

    if (newClassification) {
      req.flash("success", "New classification added successfully.");
      return res.redirect("/inventory");
    } else {
      req.flash("error", "Database insertion failed.");
      return res.redirect("/inventory/add-classification");
    }
  } catch (error) {
    console.error("Error adding classification:", error);
    req.flash("error", "An error occurred while adding classification.");
    return res.redirect("/inventory/add-classification");
  }
};

// add inventory
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
      return res.redirect("/inventory/add-inventory");
    }

    // Ensure price is a number
    if (isNaN(inv_price) || inv_price <= 0) {
      req.flash("error", "Price must be a valid number.");
      return res.redirect("/inventory/add-inventory");
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
      return res.redirect("/inventory");
    } else {
      req.flash("error", "Failed to add vehicle.");
      return res.redirect("/inventory/add-inventory");
    }
  } catch (error) {
    console.error("Error adding vehicle:", error);
    req.flash("error", "An error occurred while adding the vehicle.");
    return res.redirect("/inventory/add-inventory");
  }
};

module.exports = invCont