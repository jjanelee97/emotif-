// Header bar component that remains constant for navigation and sign out
import React from 'react';
import { Layout } from 'antd';
import firebase from 'firebase';
import SignOut from './SignOut';

import './app.css';

const { Header } = Layout;

class HeaderBar extends React.Component {
  constructor(props) {
    super(props);
    this.onSignOutButtonPress = this.onSignOutButtonPress.bind(this);
  }

  // sign user out based on press off button
  onSignOutButtonPress() {
    firebase.auth().signOut().then(() => {
      console.log('signed out');
    }).catch((error) => {
      alert(error);
    });
  }

  render() {
    return (
      <Header className="header">
        <div className="signout">
          <div className="logo">EMOTIF</div>
          <SignOut />
        </div>
      </Header>
    );
  }
}

export default HeaderBar;
