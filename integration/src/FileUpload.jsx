import axios from "axios";
import React, { useState } from "react";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  console.log(file);

  const handleSubmit = async () => {
    try {
      let formData = new FormData();
      formData.append("image", file);

      let res = await axios.post("http://localhost:3000/api/post", formData);
    } catch (error) {}
  };

  return (
    <div>
      <h1>Here we upload file from frontend to backend</h1>

      <span>select image</span>
      <input onChange={(e) => setFile(e.target.files[0])} type="file" />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default FileUpload;
