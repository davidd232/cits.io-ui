import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import LoggedIn from './LoggedIn';
import LoggedOut from './LoggedOut';

import './Core.css';

class Core extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container">
        {localStorage.getItem('token') ? <LoggedIn /> : <LoggedOut />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    //
  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    //
  }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(Core);