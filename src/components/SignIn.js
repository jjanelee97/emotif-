// Component for signing in user
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import firebase from 'firebase';
import { Button, Input } from 'antd';
import { signinUser, autoSignIn } from '../actions';
import './signin.css';


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      password: '',
    };
    this.onLoginClick = this.onLoginClick.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleUserNameChange = this.handleUserNameChange.bind(this);
  }
  componentWillMount() {
    // this.props.autoSignIn(this.state.history);
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      this.setState({ signedIn: !!user });
      if (user) {
        this.props.autoSignIn(this.props.history);
      }
    });
  }

  // user events for signing in
  onLoginClick(event) {
    this.props.signinUser(this.state.userName, this.state.password, this.props.history);
  }
  handleUserNameChange(event) {
    this.setState({ userName: event.target.value });
  }
  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }


  render() {
    if (firebase.auth().currentUser) {
      return (<div>Logging you back in...</div>);
    } else {
      return (
        <div className="background-space">
          <div className="logo-login">EMOTIF</div>
          <div className="form-space">
            <form className="form" onSubmit={this.onLoginClick}>
              <label className="label">
                Email:
                <Input type="text" className="input" value={this.state.userName} onChange={this.handleUserNameChange} />
              </label>
              <label className="label">
                Password:
                <Input type="password" className="input" value={this.state.password} onChange={this.handlePasswordChange} />
              </label>
            </form>
            <Button type="primary" size="large" onClick={this.onLoginClick} >Sign In</Button>
          </div>
        </div>
      );
    }
  }
}


const mapStateToProps = state => (
  {
    auth: state.auth,
  }
);


export default withRouter(connect(mapStateToProps, { signinUser, autoSignIn })(Login));
