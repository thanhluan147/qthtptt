import Axios from "axios";
import Url_BackEnd from "../../URL";

export const GET_ALL_MONEY_BY_STOREID_THOIDIEM_OF_DOANHTHU = async (req) => {
  const respod = await Axios.post(
    `${Url_BackEnd}/doanhthu/getSotienalldoanhthuStoreId`,
    {
      storeID: req.storeID,
      thoidiem: req.thoidiem,
    },
    {
      headers: {
        "Content-Type": "application/json",
        // Thêm các header khác nếu cần
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  return respod.data;
};

export const GET_ALL_MONEY_BY_STOREID_THOIDIEM_OF_PHIEUSTORE = async (req) => {
  const respod = await Axios.post(
    `${Url_BackEnd}/phieustore/getallsotienByStoreIdNgayLap`,
    {
      storeID: req.storeID,
      thoidiem: req.thoidiem,
    },
    {
      headers: {
        "Content-Type": "application/json",
        // Thêm các header khác nếu cần
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  return respod.data;
};
