import axios, { type AxiosResponse } from 'axios';
import Cookies from 'js-cookie'; 

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

export const login = async (data: { email: string; password: string }) => {
  const response = await api.post('/auth/login', data);
  const token = response.data.token;
  Cookies.set('authenticationToken', token); // Store token in a cookie
  return response;
};

export const logout = () => {
  const token = Cookies.get('authenticationToken');
  return api.post('/auth/logout', {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(response => {
    Cookies.remove('authenticationToken'); // Remove token from cookie
    return response;
  });
};

export const getUserInfo = (): Promise<AxiosResponse<any, any>> => {
  const token = Cookies.get('authenticationToken');
  return api.get('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const changePassword = (data: { currentPassword: string; newPassword: string }) => {
  const token = Cookies.get('authenticationToken');
  return api.post('/auth/change-password', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Files endpoints
export const uploadFile = (file: File, type: string) => {
  const token = Cookies.get('authenticationToken');
  const formData = new FormData();
  formData.append('audio', file);
  return api.post(`/files/upload?type=${type}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getFiles = (type?: string) => {
  const token = Cookies.get('authenticationToken');
  return api.get('/files/list', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { type },
  });
};

export const getFileInfoById = (id: string) => {
  const token = Cookies.get('authenticationToken');
  return api.get(`/files/info/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getFileById = (id: string) => {
  const token = Cookies.get('authenticationToken');
  return api.get(`/files/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteFile = (id: string) => {
  const token = Cookies.get('authenticationToken');
  return api.delete(`/files/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Transcribe endpoints
export const startTranscription = (audio_file_id: string) => {
  const token = Cookies.get('authenticationToken');
  return api.post(`/transcribe/${audio_file_id}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getTranscriptionList = () => {
  const token = Cookies.get('authenticationToken');
  return api.get('/transcribe/list', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getTranscriptionStatus = (jobId: string) => {
  const token = Cookies.get('authenticationToken');
  return api.get(`/transcribe/status/${jobId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteTranscription = (jobId: string) => {
  const token = Cookies.get('authenticationToken');
  return api.delete(`/transcribe/${jobId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
