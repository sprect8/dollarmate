import React, { Component }   from 'react'
import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter }         from 'react-router-dom';
/* component styles */
import { styles } from './styles.scss';
import {register, login, useAddress} from '../../core/actions/actions-login'

/* actions */
import * as uiActionCreators from 'core/actions/actions-ui';
import { TextField, FlatButton } from 'material-ui';

import LoginView from '../../components/Login';

class LoginContainer extends Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  render() {
    return (
      <LoginView {...this.props}/>
    );
  }
}

var actions = {
  register: register, 
  login: login,
  useAddress: useAddress
}

function mapStateToProps(state) {
  return {
    addresses: state.login.addresses,
    roles: state.login.roles,
    coinbase: state.login.coinbase
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      ui: bindActionCreators(uiActionCreators, dispatch),
      startup: bindActionCreators(actions, dispatch)
    }
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(LoginContainer)
)
