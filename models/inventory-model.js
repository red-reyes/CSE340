const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getInventoryByClassificationId error " + error)
  }
}

// fetch vehicle by id
async function getVehicleById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [inv_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error("getVehicleById error " + error);
  }
}

// fetch all inventory items
async function getAllInventory() {
  try {
    const data = await pool.query("SELECT * FROM public.inventory ORDER BY inv_id");
    return data.rows;
  } catch (error) {
    console.error("getAllInventory error " + error);
  }
}

// add new classification
async function addClassification(classification_name) {
  try {
    const result = await pool.query(
      `INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *`,
      [classification_name]
    );
    return result.rows[0];
  } catch (error) {
    console.error("addClassification error " + error);
  }
}

// add multiple classifications
async function addClassificationList(classificationList) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const queryText = `INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *`;
    const results = [];
    for (const classification_name of classificationList) {
      const result = await client.query(queryText, [classification_name]);
      results.push(result.rows[0]);
    }
    await client.query('COMMIT');
    return results;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("addClassificationList error " + error);
  } finally {
    client.release();
  }
}

/* ***************************
 *  Add inventory item
 * ************************** */
async function addVehicle(vehicle) {
  try {
    const sql = `INSERT INTO public.inventory (classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
    const data = await pool.query(sql, [
      vehicle.classification_id,
      vehicle.inv_make,
      vehicle.inv_model,
      vehicle.inv_year,
      vehicle.inv_description,
      vehicle.inv_image,
      vehicle.inv_thumbnail,
      vehicle.inv_price,
      vehicle.inv_miles,
      vehicle.inv_color
    ]);
    return data.rows[0];
  } catch (error) {
    console.error("addVehicle error " + error);
  }
}

// update inventory item
async function updateInventoryItem(itemData) {
  const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = itemData;
  try {
    const result = await pool.query(
      `UPDATE public.inventory 
      SET inv_make = $1, inv_model = $2, inv_year = $3, inv_description = $4, inv_image = $5, inv_thumbnail = $6, inv_price = $7, inv_miles = $8, inv_color = $9, classification_id = $10 
      WHERE inv_id = $11 RETURNING *`,
      [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("updateInventoryItem error " + error);
  }
}

// delete vehicle by id
/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventoryItem(inv_id) {
  try {
    const sql = 'DELETE FROM inventory WHERE inv_id = $1'
    const data = await pool.query(sql, [inv_id])
    return data
  } catch (error) {
    console.error("deleteInventoryItem error " + error)
  }
}

async function getInventoryById(inv_id) {
  try {
    const sql = "SELECT * FROM inventory WHERE inv_id = $1";
    const data = await pool.query(sql, [inv_id]);
    return data.rows[0] || null; // Ensure it doesn't return undefined
  } catch (error) {
    console.error("getInventoryById error:", error);
    return null;
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleById,
  getAllInventory,
  addClassification,
  addClassificationList,
  addVehicle,
  updateInventoryItem,
  deleteInventoryItem,
  getInventoryById
};
