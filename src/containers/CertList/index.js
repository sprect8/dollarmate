import React, { Component }   from 'react'
import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter }         from 'react-router-dom';
import CertificateList        from '../../components/CertificateList'

/* component styles */
import { styles } from './styles.scss';

/* actions */
import * as uiActionCreators from 'core/actions/actions-ui';
import * as certActionCreators from 'core/actions/actions-certificates';

class CertList extends Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  componentWillMount = () => {    
     // start index default to 100
  }

  render() {
    return (
      <CertificateList {...this.props}/>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      ui: bindActionCreators(uiActionCreators, dispatch),
      cert: bindActionCreators(certActionCreators, dispatch)
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
    type: state.cert.type
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CertList)
)
