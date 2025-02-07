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
    console.error("getclassificationsbyid error " + error)
  }
}
// fetch vehicle by id
async function getVehicleById(vehicle_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [vehicle_id]
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

// add new vehicle

async function addVehicle(vehicle) {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = vehicle;
  try {
    const result = await pool.query(
      `INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("addVehicle error " + error);
  }
}


module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById, getAllInventory, addClassification, addClassificationList, addVehicle};