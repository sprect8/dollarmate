import React, { Component }   from 'react'
import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter }         from 'react-router-dom';
import CreateCertificate     from '../../../components/CreateCertificate';
/* component styles */
import { styles } from './styles.scss';

/* actions */
import * as loginActionsCreators from 'core/actions/actions-login'
import * as uiActionCreators from 'core/actions/actions-ui';
import * as certActionCreators from 'core/actions/actions-certificates';

class CreateCertView extends Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  render() {
    if (this.props.userType != 0 && this.props.userType) {
      this.props.history.push({pathname:"/Home"})
    }
    return (
      <CreateCertificate {...this.props}/>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    addresses: state.login.addresses,
    roles: state.login.roles,
    coinbase: state.login.coinbase,
    contract: state.login.contract,
    userType: state.login.userType,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      ui: bindActionCreators(uiActionCreators, dispatch),      
      login: bindActionCreators(loginActionsCreators, dispatch)
    }
  };
}
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CreateCertView)
)
