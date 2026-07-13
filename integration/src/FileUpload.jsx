import axios from "axios";
import React, { useState } from "react";

const FileUpload = () => {
  const [formValues, setFormValues] = useState({});
  console.log(formValues);

  const handleSubmit = async () => {
    try {
      let formData = new FormData();
      formData.append("images", formValues.image);
      // formData.append("name", formValues.name);
      // formData.append("email", formValues.email);

      let res = await axios.post("http://localhost:3000/api/post", formData);
    } catch (error) {}
  };

  return (
    <div className="flex flex-col gap-4 w-50">
      <h1>Here we upload file from frontend to backend</h1>

      <span>select image</span>
      <input
        onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
        className="p-2 border border-black"
        type="text"
        placeholder="Name"
      />
      <input
        onChange={(e) =>
          setFormValues({ ...formValues, email: e.target.value })
        }
        className="p-2 border border-black"
        type="text"
        placeholder="Email"
      />
      <input
        multiple
        onChange={(e) =>
          setFormValues({ ...formValues, image: e.target.files[0] })
        }
        type="file"
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default FileUpload;
