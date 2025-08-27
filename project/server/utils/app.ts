import axios from 'axios';

const API_URL = 'https://ksa-1qrk.onrender.com/api';

export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      return res.data; // should contain { success, data: { user, token }, message }
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  },

  register: async (userData: any) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, userData);
      return res.data;
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  },
};
