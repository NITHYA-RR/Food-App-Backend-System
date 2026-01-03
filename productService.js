import { validationProduct, syncProduct } from "./shared/productHelpers.js";

export const createProductsService = async (db, data, targetServer) => {
  const error = validationProduct(data);
  if (error) throw new Error(error);
  const { name, price, description, image, stock } = data;

  const [result] = await db.execute(
    "INSERT INTO products (name,  price, description,image, stock) VALUES (?,?,?,?,?)",
    [name, price, description, image, stock]
  );

  await syncProduct(targetServer, {
    product_id: result.insertId, name, price, description, image, stock
  });

  return result.insertId;
};

export const getProductsService = async (db, id) => {
  let query;
  let params = [];

  console.log(id, 'IDIDIDIDI')

  if (id !== undefined && id !== null) {
    query = 'SELECT * FROM products WHERE product_id = ?';
    params.push(id);
  } else {
    query = 'SELECT * FROM products';
  }

  const [rows] = await db.execute(query, params);
  return rows;
};


export const updateProductsService = async (db, id, data, targetServer) => {
  const fields = [];
  const values = [];

  for (const key in data) {
    if (data[key] !== null && data[key] !== undefined) {
      fields.push(`${key}=?`);
      values.push(data[key]);
    }
  }

  if (fields.length === 0) throw new Error("No valid fields to update");

  values.push(id);

  await db.execute(
    `UPDATE products SET ${fields.join(", ")} WHERE product_id=?`,
    values
  );

  if (targetServer) {
    await syncProduct(targetServer, { product_id: id, ...data });
  }
};


export const deleteProductsService = async (db, id, targetServer) => {
  await db.execute("DELETE FROM products WHERE product_id=?", [id]);

  await syncProduct(targetServer, { product_id: id, action: "delete" });
};