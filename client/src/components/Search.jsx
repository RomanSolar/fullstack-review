import React from 'react';

const Search = (props) => {
  const [term, setTerm] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [notFound, setNotFound] = React.useState(false);

  const search = () => {
    setNotFound(false);
    setLoading(true);
    props.onSearch(term, error => {
      setLoading(false);
      if (error) {
        setNotFound(true);
      }
    });
    setTerm('');
  };

  const numberAlert = (key) => {
    const val = props[key];
    return loading || notFound || val === undefined
      ? null
      : <p>{val} repositories {key}</p>;
  };

  return (
    <div>
      <form>
        <h1>Github Fetcher</h1>
        <input
          value={term}
          onChange={e => setTerm(e.target.value)}
          placeholder='GitHub username'
        />
        <button type='button' onClick={search}>
          Add Repositories
        </button>
        {loading ? <p>Loading...</p> : notFound ? <p>User not found</p> : null}
        {numberAlert('imported')}
        {numberAlert('updated')}
      </form>
    </div>
  );
};

export default Search;
