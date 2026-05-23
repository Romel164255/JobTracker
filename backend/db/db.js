const { Pool } = require("pg");
const logger = require("../utils/logger");

require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

pool
  .connect()
  .then(() => {
    logger.success("Database connected (PostgreSQL)");
  })
  .catch((error) => {
    logger.error("Database connection error", error);
  });

pool.on("error", (error) => {
  logger.error("Unexpected PostgreSQL client error", error);
});

module.exports = pool;
