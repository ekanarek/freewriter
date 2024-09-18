import { useState, useEffect } from "react";
import axios from "axios";

export default function Journal() {
    const [entries, setEntries] = useState([]);

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
                                <button>Edit</button>
                                <button>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}