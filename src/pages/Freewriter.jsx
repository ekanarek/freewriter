import PhotoFetcher from "../components/PhotoFetcher.jsx";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function Freewriter() {
  const { entryId } = useParams();
  const [entry, setEntry] = useState("");
  const [photo, setPhoto] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchPhoto = async () => {
    try {
      const response = await axios.get("/api/photo");
      setPhoto(response.data);
    } catch (error) {
      console.error("Error fetching photo:", error);
    }
  };

  useEffect(() => {
    if (entryId) {
      const fetchEntry = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(`/api/entries/${entryId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          //DEBUGGING
          console.log("Fetched entry data: ", response.data);

          const entryData = response.data;
          setEntry(entryData.content);
          setPhoto(entryData.photo);
          setIsEditing(true);
        } catch (error) {
          console.error("Error fetching entry: ", error);
        }
      }; 

      fetchEntry();
    } else {
      fetchPhoto();
    }
  }, [entryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {

      if (!isEditing) {
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
      await axios.post(
        "/api/entries",
        { photoId: photoDbId, content: entry },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Your freewrite has been saved.")
      } else {
        // Update the existing journal entry
        const response = await axios.put(`/api/entries/${entryId}`, { content: entry }, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        });
        console.log("Entry saved successfully: ", response.data);
        alert("Your changes have been saved.");
      }
    } catch (error) {
      console.error("Error saving the entry:", error);
    }
  };

  return (
    <div>
      <PhotoFetcher photo={photo}/>
      <button onClick={fetchPhoto} disabled={isEditing}>New Photo</button>
      <form onSubmit={handleSubmit}>
        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="Write away..."
          rows="10"
          cols="50"
        ></textarea>
        <button type="submit" disabled={!photo}>{isEditing ? "Save Changes" : "Save Freewrite"}</button>
      </form>
    </div>
  );
}
