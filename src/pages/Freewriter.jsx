import PhotoFetcher from '../components/PhotoFetcher.jsx';
import { useState } from "react";
import axios from "axios";

export default function Freewriter() {
    const [entry, setEntry] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "/api/entries",
                { content: entry },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (error) {
            console.error("Error saving the entry:", error);
        }
    }
    
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
    )
}