import React, { Component }   from 'react'
import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter }         from 'react-router-dom';
import QRScanner        from '../../components/Scanner'

/* component styles */
import { styles } from './styles.scss';

/* actions */
import * as uiActionCreators from 'core/actions/actions-ui';

class ScannerContainer extends Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  render() {
    return (
      <QRScanner/>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      ui: bindActionCreators(uiActionCreators, dispatch)
    }
  };
}

export default withRouter(
  connect(null, mapDispatchToProps)(ScannerContainer)
)
