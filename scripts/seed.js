import { Client } from "pg";

const client = new Client({
  user: "admin",
  host: "localhost",
  database: "freewriter",
  password: "writing-is-fun",
  port: 5432,
});

client.connect();

// Create tables
const createTables = async () => {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL
    );
  `;

  const createPhotosTable = `
    CREATE TABLE IF NOT EXISTS photos (
      id SERIAL PRIMARY KEY,
      unsplash_id VARCHAR(255) NOT NULL,
      photographer VARCHAR(255) NOT NULL
    );
  `;

  const createJournalEntriesTable = `
    CREATE TABLE IF NOT EXISTS journal_entries (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      photo_id INTEGER REFERENCES photos(id) ON DELETE SET NULL,
      content TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  try {
    await client.query(createUsersTable);
    await client.query(createPhotosTable);
    await client.query(createJournalEntriesTable);
    console.log("Tables created successfully!");
  } catch (err) {
    console.error("Error creating tables:", err.stack);
  }
};

// Seed Users Table with Test Data
const seedUsers = async () => {
  const query = `
    INSERT INTO users (email, password)
    VALUES 
      ('testuser1@example.com', 'password123'),
      ('testuser2@example.com', 'password456'),
      ('testuser3@example.com', 'password789')
    RETURNING id;
  `;

  try {
    const res = await client.query(query);
    console.log("Users seeded:", res.rows);
  } catch (err) {
    console.error("Error seeding users:", err.stack);
  }
};

// Seed Photos Table with Test Data
const seedPhotos = async () => {
  const query = `
    INSERT INTO photos (unsplash_id, photographer)
    VALUES 
      ('Lpt5viNUKms', 'Alexander Mass'),
      ('aTPeCFMdv88', 'Jayanth Muppaneni'),
      ('5KvrBkAVPlA', 'Raymond Petrik')
    RETURNING id;
  `;

  try {
    const res = await client.query(query);
    console.log("Photos seeded:", res.rows);
  } catch (err) {
    console.error("Error seeding photos:", err.stack);
  }
};

// Seed Journal Entries Table with Test Data
const seedJournalEntries = async () => {
  const query = `
    INSERT INTO journal_entries (user_id, photo_id, content)
    VALUES 
      (1, 1, 'This is a test journal entry 1.'),
      (2, 2, 'This is a test journal entry 2.'),
      (3, 3, 'This is a test journal entry 3.'),
      (1, NULL, 'This is a journal entry without a photo.')
  `;

  try {
    const res = await client.query(query);
    console.log("Journal entries seeded:", res.rowCount);
  } catch (err) {
    console.error("Error seeding journal entries:", err.stack);
  }
};

// Run the seed functions
const runSeed = async () => {
  try {
    await createTables();
    await seedUsers();
    await seedPhotos();
    await seedJournalEntries();
    console.log("Seeding completed successfully!");
  } catch (err) {
    console.error("Error during seeding:", err.stack);
  } finally {
    client.end();
  }
};

runSeed();
