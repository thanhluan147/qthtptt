import Axios from "axios";
const API_URL = "http://localhost:8080";

const cloudinaryUpload = async (fileToUpload, statechinhanh) => {
  //   console.log("fileToUpload " + fileToUpload);
  //   return axios
  //     .post(API_URL + "/uploadtest", fileToUpload)
  //     .then((res) => res.data)
  //     .catch((err) => console.log(err));
  console.log("fileToUpload " + fileToUpload);
  return await Axios.post(`${API_URL}/uploadtest`, fileToUpload, {
    params: {
      statechinhanh: statechinhanh,
    },
  });
};

export default cloudinaryUpload;
