import PhotoFetcher from "../components/PhotoFetcher.jsx";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Freewriter() {
  const [entry, setEntry] = useState("");
  const [photo, setPhoto] = useState(null);

  const fetchPhoto = async () => {
    try {
      const response = await axios.get("/api/photo");
      setPhoto(response.data);
      console.log("Freewriter.jsx response: ", response.data);
    } catch (error) {
      console.error("Error fetching photo:", error);
    }
  };

  useEffect(() => {
    fetchPhoto();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      console.log("Submitting photo data:", photo);

      // Add photo to photos table
      const addPhotoResponse = await axios.post(
        "/api/photos", {
          unsplash_id: photo.id, 
          photographer: photo.user.name,
        },
        { 
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const photoDbId = addPhotoResponse.data.photoId;

      // Save journal entry
      const saveEntryResponse = await axios.post(
        "/api/entries",
        { photoId: photoDbId, content: entry },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Entry saved successfully:", saveEntryResponse.data);
    } catch (error) {
      console.error("Error saving the entry:", error);
    }
  };

  return (
    <div>
      <PhotoFetcher photo={photo}/>
      <button onClick={fetchPhoto}>New Photo</button>
      <form onSubmit={handleSubmit}>
        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="Write away..."
          rows="10"
          cols="50"
        ></textarea>
        <button type="submit" disabled={!photo}>Save Freewrite</button>
      </form>
    </div>
  );
}
