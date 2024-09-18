import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

const unsplashApi = axios.create({
  baseURL: "https://api.unsplash.com",
  headers: {
    Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
  },
});

export const getRandomPhoto = async () => {
  try {
    const response = await unsplashApi.get("/photos/random");
    return response.data;
  } catch (error) {
    console.error("Error fetching photo from Unsplash: ", error);
    throw error;
  }
};

export const fetchPhotoById = async (unsplashId) => {
  try {
    const response = await unsplashApi.get(`/photos/${unsplashId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching photo from Unsplash: ", error);
    throw error;
  }
}
