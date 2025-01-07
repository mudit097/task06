import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [files, setFiles] = useState([]); // List of files
  const [selectedFile, setSelectedFile] = useState(null); // File selected for upload
  const [loading, setLoading] = useState(false); // Loading state for actions

  // Fetch file list on component mount
  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:5000/files");
      setFiles(response.data); // Set the list of files
    } catch (error) {
      console.error("Error fetching files:", error);
      alert("Unable to fetch files. Please check the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setLoading(true);
      await axios.post("http://127.0.0.1:5000/upload", formData);
      alert("File uploaded successfully!");
      fetchFiles(); // Refresh the file list
      setSelectedFile(null); // Reset the file input
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (fileName) => {
    try {
      setLoading(true);
      await axios.post("http://127.0.0.1:5000/delete", { file_name: fileName });
      alert(`File ${fileName} deleted successfully!`);
      fetchFiles(); // Refresh the file list
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Error deleting file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">Team T6 from Section A File Manager</header>

      <div className="container">
        {/* File Upload Section */}
        <div className="upload-section">
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload} className="upload-button" disabled={loading}>
            {loading ? "Uploading..." : "Upload File"}
          </button>
        </div>

        {/* File List Section */}
        <h2>File List</h2>
        {loading && <p>Loading files...</p>}
        <ul>
          {files.map((file) => (
            <li key={file.name}>
              <a href={file.url} target="_blank" rel="noopener noreferrer">
                {file.name}
              </a>
              <button
                onClick={() => deleteFile(file.name)}
                className="delete-button"
                disabled={loading}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Team Information Section */}
      <footer className="team-section">
        <h2>Team T6 - Section A</h2>
        <p>
          Mudit Mathur | Nikhil Sharma | Ishita Shah | Nisha Dubey | Gouravi Thakur
        </p>
      </footer>
    </div>
  );
}

export default App;
