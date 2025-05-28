import axios from 'axios';
import { Blog } from '../common/interfaces/Blog';

const API_URL = 'http://localhost:2004/api/v1/blogs';

export const getAllNews = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getNewsById = async (id: Blog) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createNews = async (news: Blog) => {
  const response = await axios.post(API_URL, news);
  return response.data;
};