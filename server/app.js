import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import morgan from 'morgan';
import ViteExpress from 'vite-express';
import pg from 'pg';
import { getRandomPhoto } from './unsplashService.js';

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

app.get('/api/photo', async (req, res) => {
    try {
        const photo = await getRandomPhoto();
        res.json(photo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch photo' });
    }
});

ViteExpress.listen(app, port, () => console.log(`Server is listening on http://localhost:${port}`));