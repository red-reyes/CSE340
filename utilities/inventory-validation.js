// Function to validate if the inventory item has all required fields
function validateInventoryItem(itemData) {
  const requiredFields = [
    'inv_id', 
    'inv_make', 
    'inv_model', 
    'inv_year', 
    'inv_price', 
    'classification_id',
    'inv_color',
    'inv_description',
    'inv_miles'
  ];
  
  // Check for missing or empty fields
  for (let field of requiredFields) {
    if (!itemData[field] && itemData[field] !== 0) {
    return { isValid: false, message: `${field} is required.` };
    }
  }
  
  // Additional validation for specific fields
  if (isNaN(itemData.inv_id) || itemData.inv_id <= 0) {
    return { isValid: false, message: "inv_id must be a positive number." };
  }
  
  if (typeof itemData.inv_make !== 'string' || itemData.inv_make.trim() === '') {
    return { isValid: false, message: "inv_make must be a non-empty string." };
  }
  
  if (typeof itemData.inv_model !== 'string' || itemData.inv_model.trim() === '') {
    return { isValid: false, message: "inv_model must be a non-empty string." };
  }
  
  if (isNaN(itemData.inv_year) || itemData.inv_year < 1886 || itemData.inv_year > new Date().getFullYear() + 1) {
    return { isValid: false, message: "inv_year must be a valid car manufacturing year." };
  }
  
  if (isNaN(itemData.inv_price) || itemData.inv_price <= 0) {
    return { isValid: false, message: "inv_price must be a positive number." };
  }
  
  if (isNaN(itemData.classification_id) || itemData.classification_id <= 0) {
    return { isValid: false, message: "classification_id must be a valid number." };
  }
  
  return { isValid: true };
}
  
// Function to validate the inventory list
function validateInventoryList(inventoryList) {
  if (!Array.isArray(inventoryList)) {
    return false;
  }
  for (let itemData of inventoryList) {
    const validation = validateInventoryItem(itemData);
    if (!validation.isValid) {
      return validation;
    }
  }
  return { isValid: true };
}

// Example usage
const inventoryList = [
  { inv_id: 1, inv_make: 'Toyota', inv_model: 'Corolla', inv_year: 2020, inv_price: 20000, classification_id: 1, inv_color: 'Red', inv_description: 'A reliable car', inv_miles: 15000 },
  { inv_id: 2, inv_make: 'Honda', inv_model: 'Civic', inv_year: 2019, inv_price: 18000, classification_id: 2, inv_color: 'Blue', inv_description: 'A compact car', inv_miles: 20000 },
  { inv_id: 3, inv_make: 'Ford', inv_model: 'Mustang', inv_year: 2021, inv_price: 30000, classification_id: 3, inv_color: 'Black', inv_description: 'A sports car', inv_miles: 5000 }
];

console.log(validateInventoryList(inventoryList));