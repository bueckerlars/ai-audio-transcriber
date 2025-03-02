import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5066/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth endpoints
export const register = (data: { username: string; email: string; password: string }) => {
  return api.post('/auth/register', data);
};

export const login = (data: { email: string; password: string }) => {
  return api.post('/auth/login', data);
};

export const getUserInfo = (token: string) => {
  return api.get('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const changePassword = (token: string, data: { currentPassword: string; newPassword: string }) => {
  return api.post('/auth/change-password', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Files endpoints
export const uploadFile = (file: File, type: string) => {
  const formData = new FormData();
  formData.append('audio', file);
  return api.post(`/files/upload?type=${type}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getFiles = (type?: string) => {
  return api.get('/files/list', {
    params: { type },
  });
};

export const getFileById = (id: string) => {
  return api.get(`/files/${id}`);
};

export const deleteFile = (id: string) => {
  return api.delete(`/files/${id}`);
};

// Transcribe endpoints
export const startTranscription = (audio_file_id: string) => {
  return api.post(`/transcribe/${audio_file_id}`);
};

export const getTranscriptionStatus = (jobId: string) => {
  return api.get(`/transcribe/status/${jobId}`);
};
