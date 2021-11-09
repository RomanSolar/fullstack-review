const axios = require('axios');

const db = require('../database');

const auth = {
  headers: {
    'User-Agent': 'request',
    'Authorization': `token ${process.env.TOKEN}`
  }
};

const query = async (url) => {
  const response = await axios.get(url, auth);
  return response.data;
};

const getReposByUsername = async (username) => {
  const response = await query(`https://api.github.com/users/${username}/repos`);
  return response;
};

module.exports = { query, getReposByUsername };
