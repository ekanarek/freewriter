import dotenv from "dotenv";
dotenv.config();

import pkg from "pg";
const { Client } = pkg;

const client = new Client({ connectionString: process.env.DATABASE_URL });

client.connect((err) => {
  if (err) {
    console.error("Database connection error:", err.stack);
  } else {
    console.log("Connected to database");
  }
});

export default client;
