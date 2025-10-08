import axios from "axios";

const API_URL = "http://localhost:3000/api/sach";

export const getBooks = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const dangKyMuonSach = async (docGiaID, MASACH, SOQUYEN, NGAYMUON) => {
  console.log("Thông tin mượn sách:", { docGiaID, MASACH, SOQUYEN, NGAYMUON });
  if (!NGAYMUON) {
    console.error("Lỗi: ngày mượn hoặc ngày trả không hợp lệ", { NGAYMUON });
    return Promise.reject(new Error("Ngày mượn và ngày trả không được để trống"));
  }

  const requestData = {
    docGiaID,
    MASACH,
    SOQUYEN: SOQUYEN,
    NGAYMUON,
    };

  try {
    await axios.post("http://localhost:3000/api/theodoi/dangKyMuonSach", requestData);
  } catch (error) {
    console.error("Lỗi khi gọi API mượn sách:", error.response?.data || error.message);
    throw error; 
  }
};

