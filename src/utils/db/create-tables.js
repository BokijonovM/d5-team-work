import pool from "./connect.js";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { join, dirname } from "path";

const dirnameOfSQLFilePath = dirname(fileURLToPath(import.meta.url));

const sqlFilePath = join(dirnameOfSQLFilePath, "tables.sql");

const createTables = async () => {
  try {
    const sqlQueryAsString = await fs.readFile(sqlFilePath, "utf-8");
    await pool.query(sqlQueryAsString);
    console.log("✅ Tables are successfully created");
    await pool.end();
  } catch (error) {
    console.log("❌ Tables are not created");
    console.log(error);
  }
};

createTables();
