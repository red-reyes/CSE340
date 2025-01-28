const vehicles = [
  { id: '1', make: 'Unknown', model: 'Batmobile Custom', category: 'custom', year: 2023, price: 65000, image: 'images/vehicles/batmobile.jpg', mileage: 1500, mpg: 12, exteriorColor: 'Black', interiorColor: 'Red', fuelType: 'Gasoline', driveTrain: 'AWD', transmission: 'Automatic', stockNumber: 'B123', vin: '1A2B3C4D5E6F7G8H9I0J1K2L3M4N5' },
  { id: '2', make: 'Unknown', model: 'FBI Surveillance Van', category: 'custom', year: 2023, price: 20000, image: 'images/vehicles/survan.jpg', mileage: 2500, mpg: 8, exteriorColor: 'White', interiorColor: 'Black', fuelType: 'Gasoline', driveTrain: '4WD', transmission: 'Manual', stockNumber: 'S124', vin: '1B2C3D4E5F6G7H8I9J0K1L2M3N4O5' },
  { id: '3', make: 'Unknown', model: 'Dog Car', category: 'custom', year: 2023, price: 35000, image: 'images/vehicles/dog-car.jpg', mileage: 1200, mpg: 15, exteriorColor: 'Green', interiorColor: 'Brown', fuelType: 'Gasoline', driveTrain: 'FWD', transmission: 'Automatic', stockNumber: 'D125', vin: '1C2D3E4F5G6H7I8J9K0L1M2N3O4P5' },
  { id: '4', make: 'Unknown', model: 'Aero Car', category: 'custom', year: 2023, price: 80000, image: 'images/vehicles/aerocar.jpg', mileage: 500, mpg: 18, exteriorColor: 'Silver', interiorColor: 'Blue', fuelType: 'Electric', driveTrain: 'AWD', transmission: 'Automatic', stockNumber: 'A126', vin: '1D2E3F4G5H6I7J8K9L0M1N2O3P4Q5' },
  { id: '5', make: 'Unknown', model: 'Monster Truck', category: 'custom', year: 2023, price: 89000, image: 'images/vehicles/monster-truck.jpg', mileage: 2000, mpg: 6, exteriorColor: 'Red', interiorColor: 'Black', fuelType: 'Gasoline', driveTrain: '4WD', transmission: 'Manual', stockNumber: 'M127', vin: '1E2F3G4H5I6J7K8L9M0N1O2P3Q4R5' },
  { id: '6', make: 'Unknown', model: 'Mystery Van', category: 'custom', year: 2023, price: 30000, image: 'images/vehicles/mystery-van.jpg', mileage: 800, mpg: 12, exteriorColor: 'Orange', interiorColor: 'Gray', fuelType: 'Gasoline', driveTrain: 'RWD', transmission: 'Automatic', stockNumber: 'V128', vin: '1F2G3H4I5J6K7L8M9N0O1P2Q3R4S5' },
  { id: '7', make: 'Chevrolet', model: 'Chevy Camaro', category: 'sport', year: 2023, price: 25000, image: 'images/vehicles/camaro.jpg', mileage: 1000, mpg: 20, exteriorColor: 'Yellow', interiorColor: 'Black', fuelType: 'Gasoline', driveTrain: 'RWD', transmission: 'Manual', stockNumber: 'C129', vin: '1G2H3I4J5K6L7M8N9O0P1Q2R3S4T5' },
  { id: '8', make: 'Lamborghini', model: 'Lamborghini Adventador', category: 'sport', year: 2023, price: 417650, image: 'images/vehicles/adventador.jpg', mileage: 300, mpg: 10, exteriorColor: 'Yellow', interiorColor: 'Black', fuelType: 'Gasoline', driveTrain: 'AWD', transmission: 'Automatic', stockNumber: 'L130', vin: '1H2I3J4K5L6M7N8O9P0Q1R2S3T4U5' },
  { id: '9', make: 'Jeep', model: 'Jeep Wrangler', category: 'suv', year: 2023, price: 417650, image: 'images/vehicles/wrangler.jpg', mileage: 1000, mpg: 22, exteriorColor: 'Blue', interiorColor: 'Gray', fuelType: 'Gasoline', driveTrain: '4WD', transmission: 'Manual', stockNumber: 'J131', vin: '1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5' },
  { id: '10', make: 'Jeep', model: 'Cadillac Escalade', category: 'truck', year: 2023, price: 75195, image: 'images/vehicles/escalade.jpg', mileage: 1500, mpg: 20, exteriorColor: 'Black', interiorColor: 'White', fuelType: 'Gasoline', driveTrain: 'AWD', transmission: 'Automatic', stockNumber: 'C132', vin: '1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5' },
  { id: '11', make: 'General Motors', model: 'GM Hummer', category: 'truck', year: 2023, price: 58000, image: 'images/vehicles/hummer.jpg', mileage: 1500, mpg: 20, exteriorColor: 'Black', interiorColor: 'White', fuelType: 'Gasoline', driveTrain: 'AWD', transmission: 'Automatic', stockNumber: 'C132', vin: '1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5' },
  { id: '12', make: 'Unknown', model: 'Bat Mobile', category: 'sedan', year: 2023, price: 70000, image: 'images/vehicles/batmobile.jpg', mileage: 1500, mpg: 20, exteriorColor: 'Black', interiorColor: 'White', fuelType: 'Gasoline', driveTrain: 'AWD', transmission: 'Automatic', stockNumber: 'C132', vin: '1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5' },
];

// Get vehicles by category
exports.getVehiclesByCategory = (category) => {
  return new Promise((resolve, reject) => {
    const categoryVehicles = vehicles.filter(v => v.category === category);
    if (categoryVehicles.length > 0) {
      resolve(categoryVehicles);
    } else {
      reject(new Error(`No vehicles found in ${category} category`));
    }
  });
};

// Get a specific vehicle by its ID
exports.getVehicleById = (id) => {
  return new Promise((resolve, reject) => {
    const vehicle = vehicles.find(v => v.id === id);
    if (vehicle) {
      resolve(vehicle);
    } else {
      reject(new Error('Vehicle not found'));
    }
  });
};
