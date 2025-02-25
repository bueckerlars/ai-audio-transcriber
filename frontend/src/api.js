import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5066/api/v1";

// 🔹 Datei hochladen
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("audio", file);
  return axios.post(`${API_URL}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// 🔹 Liste aller hochgeladenen Audiodateien abrufen
export const getUploadedFiles = async () => {
  return axios.get(`${API_URL}/uploads`);
};

// 🔹 Liste aller Transkriptionen abrufen
export const getTranscriptions = async () => {
  return axios.get(`${API_URL}/transcriptions`);
};

// 🔹 Einzelne Datei abrufen
export const getFile = async (type, filename) => {
  return axios.get(`${API_URL}/${type}/${filename}`, { responseType: "blob" });
};
