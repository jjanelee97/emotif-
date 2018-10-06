// Authentication components to sign user in

import React from 'react';
import { connect } from 'react-redux';

export default function (ComposedComponent) {
  class RequireAuth extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
    }

    componentWillMount() {
      console.log(this.props.authenticated);
      if (!this.props.authenticated) {
        this.props.history.push('/signin');
      }
    }

    componentWillUpdate(nextProps) {
      if (!nextProps.authenticated) {
        this.props.history.push('/signin');
      }
    }

    render() {
      return (
        <ComposedComponent {...this.props} />
      );
    }
  }

  const mapStateToProps = state => (
    {
      authenticated: state.auth.authenticated,
    }
  );

  return connect(mapStateToProps, null)(RequireAuth);
}
