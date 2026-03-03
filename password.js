import bcrypt from "bcrypt";
import pool from "./src/db/pool.js";

const hash = await bcrypt.hash("password123", 10);

await pool.query(`
  UPDATE users
  SET password_hash = $1
`, [hash]);