import Axios from "axios";
const API_URL = "http://localhost:8080";

const cloudinaryUpload = async (fileToUpload, statechinhanh) => {
  console.log("fileToUpload " + fileToUpload);
  console.log("file Upload tem " + fileToUpload);
  return await Axios.post(`${API_URL}/uploadtest`, fileToUpload, {
    params: {
      statechinhanh: statechinhanh,
    },
  });
};

export default cloudinaryUpload;
