import React, { Component }   from 'react'
import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter }         from 'react-router-dom';
import QRScanner        from '../../components/Scanner';
import PayComponent     from '../../components/Pay';
/* component styles */
import { styles } from './styles.scss';

/* actions */
import * as certActionCreators from 'core/actions/actions-certificates';
import * as uiActionCreators from 'core/actions/actions-ui';
import * as loginActionsCreators from '../../core/actions/actions-login'
import * as accActionCreators from 'core/actions/actions-accounts';

class PayView extends Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  render() {
    return (
      <PayComponent {...props}/>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    addresses: state.login.addresses,
    roles: state.login.roles,
    coinbase: state.login.coinbase,
    userType: state.login.userType,
    contract: state.login.contract,
    accError: state.acc.error,
    balance: state.acc.balance,
    iDinar: state.acc.iDinar,
    tx: state.acc.tx
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      ui: bindActionCreators(uiActionCreators, dispatch),
      startup: bindActionCreators(loginActionsCreators, dispatch),
      acc: bindActionCreators(accActionCreators, dispatch),
    }
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PayView)
)
