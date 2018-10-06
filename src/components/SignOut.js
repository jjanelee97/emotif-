// Component for signing out
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Button } from 'antd';

import { signoutUser } from '../actions';


class SignOut extends Component {
  constructor(props) {
    super(props);
    this.onSignOutClick = this.onSignOutClick.bind(this);
  }

  // event for handling when user clicks signout
  onSignOutClick(event) {
    this.props.signoutUser(this.props.history);
  }

  // exported and used in Header Bar
  render() {
    return (
      <Button onClick={this.onSignOutClick}>Sign Out</Button>
    );
  }
}


const mapStateToProps = state => (
  {
    auth: state.auth,
  }
);


export default withRouter(connect(mapStateToProps, { signoutUser })(SignOut));
