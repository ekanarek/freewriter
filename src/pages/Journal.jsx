import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/entries", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEntries(response.data);
      } catch (error) {
        console.error("Error fetching entries: ", error);
      }
    };

    fetchEntries();
  }, []);

  const handleEdit = (entryId) => {
    navigate(`/entries/${entryId}?`);
  };

  const handleDelete = async (entryId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete? This action cannot be undone."
    );

    if (isConfirmed) {
      const token = localStorage.getItem("token");

      try {
        await axios.delete(`/api/entries/${entryId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setEntries((prevEntries) =>
          prevEntries.filter((entry) => entry.id !== entryId)
        );
      } catch (error) {
        console.error("Error deleting entry: ", error);
      }
    }
  };

  return (
    <div>
      <h2>My Journal Entries</h2>
      <table>
        <thead>
          <tr>
            <th>Created On</th>
            <th>Preview</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td>{new Date(entry.created_at).toLocaleDateString()}</td>
              <td>{entry.content.split("/n")[0]}</td>
              <td>
                <button onClick={() => handleEdit(entry.id)}>Edit</button>
                <button onClick={() => handleDelete(entry.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
