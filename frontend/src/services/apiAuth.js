import axios from 'axios';


const apiAuth = axios.create({
  // baseURL: 'http://localhost:22080/api', process.env.REACT_APP_API_URL
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default apiAuth;
