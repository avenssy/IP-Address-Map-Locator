import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.1.139:8000/api', 
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export const signup = async (email, password) => {
  try {
    const response = await api.post('/signup', {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Signup API error:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const login = async (email, password) => {
    try {
      const response = await api.post('/login', {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      console.error("Login API error:", error.response ? error.response.data : error.message);
      throw error;
    }
  };