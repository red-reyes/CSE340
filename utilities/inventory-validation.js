// Function to validate if the inventory item has all required fields
function validateInventoryItem(item) {
    const requiredFields = ['inv_id', 'inv_name', 'inv_quantity', 'inv_price'];
    for (let field of requiredFields) {
        if (!item.hasOwnProperty(field)) {
            return false;
        }
    }
    return true;
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
    { id: 1, name: 'Item 1', quantity: 10, price: 100 },
    { id: 2, name: 'Item 2', quantity: 5, price: 50 },
    { id: 3, name: 'Item 3', quantity: 20, price: 200 }
];

console.log(validateInventoryList(inventoryList)); // Should print true