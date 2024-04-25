import React, { useState } from "react";
import * as XLSX from "xlsx";
import cloudinaryUpload from "./handleclound";

const Testform = () => {
  const [statechinhanh, setchinhanh] = useState("");
  const handleFileUpload = async (e) => {
    try {
      const uploadData = new FormData();
      uploadData.append("file", e.target.files[0], "file");
      await cloudinaryUpload(uploadData, statechinhanh);
      alert("update ảnh thành công");
    } catch (error) {
      console.log("Chỉ được update hình ảnh");
      console.log(error);
    }
  };

  return (
    <div>
      <div style={{ margin: 10 }}>
        <label style={{ margin: 10 }}>Cloudinary:</label>
        <input type="file" onChange={(e) => handleFileUpload(e)} />
      </div>
      <div>
        <input
          type="text"
          value={statechinhanh}
          onChange={(e) => {
            setchinhanh(e.target.value);
          }}
        />
      </div>
    </div>
  );
};
export default Testform;
