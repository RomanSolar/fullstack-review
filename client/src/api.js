const axios = require('axios');
const types = require('../../types');

const request = async (method, data) => {
  /** @type {axios.AxiosResponse} */
  const response = await axios.request({
    method,
    data,
    url: `http://${process.env.HOST}:${process.env.PORT}/repos`,
    headers: { 'Content-Type': 'text/plain' }
  });
  return response.data;
};

/** @returns {Promise<{repos: types.Repo[], count: number}>} */
const getTop = async () => {
  const results = await request('GET');
  return results;
};

/** @returns {Promise<{updated: number, imported: number, repos: types.Repo[], count: number}>} */
const install = async (username) => {
  const results = await request('POST', username);
  return results;
};

export default { getTop, install };
