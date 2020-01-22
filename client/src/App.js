import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import Fibonacci from './Fibonacci';
import OtherPage from './OtherPage';

import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <img src={logo} className="App-logo" alt="logo" />
        <div>
          <Link to="/">Home</Link>
          <Link to="/other">Other</Link>
        </div>
        <br />
        <Route exact path="/" component={Fibonacci} />
        <Route path="/other" component={OtherPage} />
      </div>
    </Router >
  );
}

export default App;
