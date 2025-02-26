import axios from "axios";

const API_BASE_URL = "http://localhost:5066/api/v1";

// Upload an audio file
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("audio", file);
  return axios.post(`${API_BASE_URL}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Get list of uploaded files
export const getUploadedFiles = async () => {
  return axios.get(`${API_BASE_URL}/uploads`);
};

// Get list of transcriptions
export const getTranscriptions = async () => {
  return axios.get(`${API_BASE_URL}/transcriptions`);
};

// Download a specific file
export const downloadFile = async (type, filename) => {
  return axios.get(`${API_BASE_URL}/${type}/${filename}`, {
    responseType: "blob", // Ensure proper file handling
  });
};
