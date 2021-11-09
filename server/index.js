require('dotenv').config();

const express = require('express');

const db = require('../database');
const github = require('../helpers/github');

const app = express();
app.use(express.text());
app.use(express.static(__dirname + '/../client/dist'));

const NON_ALPHANUM = /[^-A-Za-z0-9]/;

app.post('/repos', async (req, res) => {
  const username = req.body;
  if (NON_ALPHANUM.test(username)) {
    res.status(400).send();
    return;
  }
  try {
    const importing = await github.getReposByUsername(username);
    const { imported, updated } = await db.save(importing);
    const { repos, count } = await db.getMany(25);
    res.status(201).send({ imported, updated, repos, count });
  } catch (e) {
    if (e.message === 'Request failed with status code 404') {
      res.status(404).send();
    } else {
      console.error(e);
      res.status(500).send(e);
    }
  }
});

app.get('/repos', async (req, res) => {
  try {
    const repos = await db.getMany(25);
    res.status(201).send(repos);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

app.get('/friends/:id', async (req, res) => {
  const user = req.params.id;
  if (isNaN(user)) {
    res.status(400).send();
    return;
  }
  try {
    const friends = await db.getFriends(user);
    res.send(friends);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

app.listen(process.env.PORT, function() {
  console.log(`\x1B[0mlistening on port ${process.env.PORT}`);
});

