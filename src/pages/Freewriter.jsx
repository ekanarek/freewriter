import PhotoFetcher from "../components/PhotoFetcher.jsx";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Freewriter() {
  const [entry, setEntry] = useState("");
  const [photoId, setPhotoId] = useState("");

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const response = await axios.get("/api/photo");
        setPhotoId(response.data.id);
      } catch (error) {
        console.error("Error fetching photo:", error);
      }
    };
    fetchPhoto();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/api/entries",
        { photoId: photoId, content: entry },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Entry saved successfully:", response.data);
    } catch (error) {
      console.error("Error saving the entry:", error);
    }
  };

  return (
    <div>
      <PhotoFetcher />
      <form onSubmit={handleSubmit}>
        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="Write away..."
          rows="10"
          cols="50"
        ></textarea>
        <button type="submit">Save Freewrite</button>
      </form>
    </div>
  );
}
