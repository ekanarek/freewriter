import axios from 'axios';

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

const unsplashApi = axios.create({
    baseURL: 'http://api.unsplash.com',
    headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
    }
});

export const getRandomPhoto = async () => {
    try {
        const response = await unsplashApi.get('/photos/random');
        return response.data;
    } catch (error) {
        console.error('Error fetching photo from Unsplash: ', error);
        throw error;
    }
}