const inventoryModel = require('../models/inventoryModel');

// Controller function to get a specific vehicle detail
exports.getVehicleDetail = (req, res, next) => {
  const vehicleId = req.params.id;
  inventoryModel.getVehicleById(vehicleId)
    .then(vehicle => {
      if (!vehicle) {
        const error = new Error('Vehicle not found');
        error.statusCode = 404;
        throw error;
      }

      res.render('inventory/vehicle-detail', {
        pageTitle: `${vehicle.make} ${vehicle.model}`,
        vehicle: vehicle
      });
    })
    .catch(err => {
      next(err);
    });
};

// Controller function to get vehicles by category
exports.getVehiclesByCategory = (category) => {
  return (req, res, next) => {
    inventoryModel.getVehiclesByCategory(category)
      .then(vehicles => {
        if (vehicles.length === 0) {
          const error = new Error(`No vehicles found in ${category} category`);
          error.statusCode = 404;
          throw error;
        }

        // Render category page with vehicles
        res.render('inventory/category', {
          pageTitle: `${category.charAt(0).toUpperCase() + category.slice(1)} Vehicles`,
          vehicles: vehicles
        });
      })
      .catch(err => {
        next(err); // Pass errors to the error handler
      });
  };
};