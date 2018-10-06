// High level app structure with routes for signin and journal editor
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import firebase from 'firebase';
import Editor from './Editor';
import JournalList from './JournalList';
import '../style.scss';
import './app.css';
import requireAuth from '../containers/requireAuth';
import Login from './SignIn';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.onSignIn = this.onSignIn.bind(this);
    this.onTestButtonPress = this.onTestButtonPress.bind(this);
    this.loginCheck = this.loginCheck.bind(this);

    this.state = {
      signedIn: false,
    };
  }

  // before Render, sign in user with credentials
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      this.setState({ signedIn: !!user });
      if (user) {
        console.log(`we got a user!${user.email}`);
      }
    });
  }

  onSignIn(retVal) {
    console.log(retVal);
    this.setState({ signedIn: true });
  }

  onTestButtonPress() {
    console.log(firebase.auth().currentUser);
  }

  loginCheck() {
    console.log('loginCheck');
  }

  // rendering the entire app
  render() {
    console.log(this.state.signedIn);
    return (
      <Router>
        <div>
          {this.loginCheck()}
          <Switch>
            <Route exact path="/" component={requireAuth(JournalList)} />
            <Route path="/signin" component={Login} />
            <Route path="/journal-editor" component={requireAuth(Editor)} />
            {/* <Route component={FallBack} /> */}
          </Switch>
        </div>
      </Router>
    );
    // }
  }
}


export default App;
