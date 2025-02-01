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

module.exports = invCont