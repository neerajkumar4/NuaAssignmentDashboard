import axios from "axios";

const BASE_URL = "https://openlibrary.org";

export const fetchBooks = async (query, page = 1, limit = 10) => {
  const response = await axios.get(`${BASE_URL}/search.json`, {
    params: {
      q: query,
      page,
      limit,
    },
  });
  return response.data;
};

export const fetchBookDetails = async (bookId) => {
  const response = await axios.get(`${BASE_URL}/works/${bookId}.json`);
  return response.data;
};

export const fetchAuthorDetails = async (authorKey) => {
    const response = await axios.get(`${BASE_URL}/authors/${authorKey}.json`);
    return response.data;
  };

  export const fetchAuthorTopwork = async (authorKey) => {
    const response = await axios.get(`${BASE_URL}/authors/${authorKey}/works.json`);
    return response.data.entries[0].title;
  };

