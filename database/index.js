const mongoose = require('mongoose');
const github = require('../helpers/github');

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

const repoSchema = mongoose.Schema({
  _id: Number,
  owner: Number,
  name: String,
  url: String,
  stars: Number
});

/** @type {mongoose.Model} */
const Repo = mongoose.model('Repo', repoSchema);

const userSchema = mongoose.Schema({
  _id: Number,
  name: String
});

/** @type {mongoose.Model} */
const User = mongoose.model('User', userSchema);

const friendSchema = mongoose.Schema({
  user: Number,
  friend: Number
});
friendSchema.index({ user: 1, friend: 1}, { unique: true });

/** @type {mongoose.Model} */
const Friend = mongoose.model('Friend', friendSchema);

const getMany = async (limit, sortBy = { stars: 'desc' }) => {
  const repos = await Repo.find().limit(limit).sort(sortBy);
  const count = await Repo.estimatedDocumentCount();
  return { repos, count };
};

const save = async (data) => {
  const friends = [];
  let imported = 0;
  let updated = 0;

  for (const datum of data) {
    const repo = new Repo({
      _id: datum.id,
      owner: datum.owner.id,
      name: datum.full_name,
      url: datum.html_url,
      stars: datum.stargazers_count,
    });

    const result = await Repo.replaceOne({_id: datum.id }, repo, { upsert: true });
    if (result.upserted) {
      imported++;
    } else {
      updated++;
    }
  }

  await Friend.insertMany(friends);

  const contribs = await Promise.all(data.map(async (datum) => {
    const user = datum.id;
    const contribs = await github.query(datum.contributors_url);
    return contribs
      .filter(contrib => contrib.id !== user && contrib.type === 'User')
      .map(contrib => new Friend({ user, friend: contrib.id }));
  }));

  try {
    await Friend.insertMany(contribs.flat(), {ordered: false});
  } catch (e) {
    // Do nothing. Duplicate collisions are not a problem.
  }

  return { imported, updated };
};

const getFriends = async (user) => {
  const results = await Friend.find({ user });
  return results.map(result => result.friend);
};

module.exports = { getFriends, getMany, save };
