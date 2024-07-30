import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import morgan from 'morgan';
import ViteExpress from 'vite-express';
import pg from 'pg';

const { Client } = pg;
const app = express();
const port = process.env.PORT || 8000;

const client = new Client({
    connectionString: process.env.DATABASE_URL
});

client.connect()
    .then(() => console.log('Connected to database'))
    .catch(err => console.error('Connection error', err.stack));

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));

ViteExpress.config({ printViteDevServerHost: true });

// Routes go here

ViteExpress.listen(app, port, () => console.log(`Server is listening on http://localhost:${port}`));