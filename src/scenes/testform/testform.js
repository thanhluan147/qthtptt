import React, { useState } from "react";
import * as XLSX from "xlsx";
<<<<<<< HEAD

const Testform = () => {
  const [htmlTable, setHtmlTable] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const excelData = XLSX.utils.sheet_to_html(workbook.Sheets[sheetName]);

        setHtmlTable(excelData);
      };

      reader.readAsBinaryString(file);
    }
  };
  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <div dangerouslySetInnerHTML={{ __html: htmlTable }} />
=======
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
      
>>>>>>> master
    </div>
  );
};
export default Testform;
