// Function to validate if the inventory item has all required fields
function validateInventoryItem(item) {
    const requiredFields = [
      'inv_id', 
      'inv_make', 
      'inv_model', 
      'inv_year', 
      'inv_price', 
      'classification_id'
    ];
  
    // Check for missing or empty fields
    for (let field of requiredFields) {
      if (!item[field] && item[field] !== 0) {
        return { isValid: false, message: `${field} is required.` };
      }
    }
  
    // Additional validation for specific fields
    if (isNaN(item.inv_id) || item.inv_id <= 0) {
      return { isValid: false, message: "inv_id must be a positive number." };
    }
  
    if (typeof item.inv_make !== 'string' || item.inv_make.trim() === '') {
      return { isValid: false, message: "inv_make must be a non-empty string." };
    }
  
    if (typeof item.inv_model !== 'string' || item.inv_model.trim() === '') {
      return { isValid: false, message: "inv_model must be a non-empty string." };
    }
  
    if (isNaN(item.inv_year) || item.inv_year < 1886 || item.inv_year > new Date().getFullYear() + 1) {
      return { isValid: false, message: "inv_year must be a valid car manufacturing year." };
    }
  
    if (isNaN(item.inv_price) || item.inv_price <= 0) {
      return { isValid: false, message: "inv_price must be a positive number." };
    }
  
    if (isNaN(item.classification_id) || item.classification_id <= 0) {
      return { isValid: false, message: "classification_id must be a valid number." };
    }
  
    return { isValid: true };
  }
  
// Function to validate the inventory list
function validateInventoryList(inventoryList) {
    if (!Array.isArray(inventoryList)) {
        return false;
    }
    for (let item of inventoryList) {
        if (!validateInventoryItem(item)) {
            return false;
        }
    }
    return true;
}

// Example usage
const inventoryList = [
    { inv_id: 1, inv_name: 'Item 1', inv_quantity: 10, inv_price: 100 },
    { inv_id: 2, inv_name: 'Item 2', inv_quantity: 5, inv_price: 50 },
    { inv_id: 3, inv_name: 'Item 3', inv_quantity: 20, inv_price: 200 }
];

console.log(validateInventoryList(inventoryList)); // Should print true