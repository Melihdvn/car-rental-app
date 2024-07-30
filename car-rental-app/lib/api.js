import axios from "axios";

// API URL
const apiUrl = "http://192.168.24.46:8000/api";

// POST İsteği Gönderme Fonksiyonu
export const post = async (method, params, header = {}) => {
  try {
    const result = await axios.post(apiUrl + method, params, header);
    return result.data;
  } catch (error) {
    if (error.response) {
      // Sunucu tarafı hata kodları
      if (error.response.status === 401) {
        return { error: "Unauthorized", status: error.response.status };
      } else if (error.response.status === 400) {
        return { error: "Bad Request", status: error.response.status };
      }
      // Diğer hata kodları
      return {
        error: error.response.data.message || "Something went wrong",
        status: error.response.status,
      };
    } else {
      // Ağaç bağlantı veya ağ hatası
      return { error: "Network error or server is down", status: null };
    }
  }
};

// GET İsteği Gönderme Fonksiyonu
export const get = async (method, header = {}) => {
  try {
    const result = await axios.get(apiUrl + method, header);
    return result.data;
  } catch (error) {
    if (error.response) {
      // Sunucu tarafı hata kodları
      if (error.response.status === 401) {
        return { error: "Unauthorized", status: error.response.status };
      } else if (error.response.status === 400) {
        return { error: "Bad Request", status: error.response.status };
      }
      // Diğer hata kodları
      return {
        error: error.response.data.message || "Something went wrong",
        status: error.response.status,
      };
    } else {
      // Ağaç bağlantı veya ağ hatası
      return { error: "Network error or server is down", status: null };
    }
  }
};
