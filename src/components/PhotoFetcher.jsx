import { useState, useEffect } from "react";
import axios from "axios";

export default function PhotoFetcher() {
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const response = await axios.get("/api/photo");
        setPhoto(response.data);
      } catch (error) {
        console.error("Error fetching photo: ", error);
      }
    };

    fetchPhoto();
  }, []);

  return (
    <div>
      {photo ? (
        <div>
          <img src={photo.urls.small} alt={photo.alt_description} />
          <p><a href={photo.user.links.html}>© {photo.user.name} on Unsplash</a></p>
        </div>
      ) : (
        <p>Loading photo...</p>
      )}
    </div>
  );
}
