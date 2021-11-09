import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import regeneratorRuntime from 'regenerator-runtime';
import Search from './components/Search.jsx';
import RepoList from './components/RepoList.jsx';
import api from './api';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      repos: [],
      count: 0
    };
    api.getTop().then(response => this.setState(response));
  }

  search (term, callback) {
    api.install(term).then(response => {
      this.setState(response);
      callback();
    }).catch(callback);
  }

  render () {
    return (<div>
      <Search
        onSearch={this.search.bind(this)}
        imported={this.state.imported}
        updated={this.state.updated}
      />
      <RepoList repos={this.state.repos} count={this.state.count}/>
    </div>);
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
