import React, { Component }   from 'react'
import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter }         from 'react-router-dom';
import CertificateView        from '../../components/CertificateView'

/* component styles */
import { styles } from './styles.scss';

/* actions */
import * as loginActionsCreators from '../../core/actions/actions-login'
import * as uiActionCreators from 'core/actions/actions-ui';
import * as certActionCreators from 'core/actions/actions-certificates';

class CertView extends Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  componentDidMount = () => {
    console.log(this.props)
    if (!this.props.location.state || !this.props.location.state.address) {
      this.props.history.push({
        pathname: "/certificateList"
      })
    }
    else {
      this.props.actions.cert.fetchCertificate(this.props.location.state.address);
    }
  }

  render() {
    return (
      <CertificateView {...this.props}/>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      ui: bindActionCreators(uiActionCreators, dispatch),
      cert: bindActionCreators(certActionCreators, dispatch),
      login: bindActionCreators(loginActionsCreators, dispatch)
    }
  };
}

function mapStateToProps(state) {
  console.log(state);
  return {
    certificates: state.cert.certificates,
    certificate: state.cert.certificate,
    error: state.cert.error,
    certId: state.cert.certId,
    type: state.cert.type,
    coinbase: state.login.coinbase,
    userType: state.login.userType,
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CertView)
)
