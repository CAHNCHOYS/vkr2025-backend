import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 1000,
  queueLimit: 0,
  multipleStatements: true,
});

export default connection;
