import React, { Component }   from 'react';
import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';
import injectTapEventPlugin   from 'react-tap-event-plugin';
import MuiThemeProvider       from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import muiTheme               from './styles/theme/mui-theme'
import { HashRouter,
         Route,
         Redirect,
         Switch }             from 'react-router-dom';

/* 
 * Import global styles into entire app 
 */
import './styles/app.scss';

/* actions */
import * as uiActionCreators  from 'core/actions/actions-ui';
import * as loginActionCreators  from 'core/actions/actions-login';

/* application containers & components */
import Header         from 'containers/Header';
import LeftNavBar     from 'containers/LeftNavBar';
import HomeView       from 'containers/HomeView';
import CertView       from 'containers/CertView';
import CertList       from 'containers/CertList';
import TransferView   from 'containers/Transfer';
import Modal          from 'components/Modal';
import PayView        from 'components/Pay';
import CollectContainer from 'containers/Collect';
import CreateCertView from 'containers/Custodian/CreateCertView';
import ScannerContainer from 'components/Scanner';
import LoginContainer from 'containers/Login';

injectTapEventPlugin();

export class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { ui, actions } = this.props;
    console.log(this.props);

    if (!this.props.login || !this.props.login.coinbase) {            
      return (
      <MuiThemeProvider>
        <div>
          <HashRouter>
            <div>
              <Route path="*" component={LoginContainer}/>                              
            </div>
          </HashRouter>
        </div>
    </MuiThemeProvider> )         
    }
    
    return (
      <MuiThemeProvider>
        <div>
          <HashRouter>
            <div>
              <Header />
              <div className="container">
                <Switch>
                  <Route path="/home" component={HomeView} />
                  <Route path="/certificateView" component={CertView} />
                  <Route path="/certificateList/*" component={CertList} />
                  <Route path="/certificateList" component={CertList} />
                  <Route path="/collect" component={CollectContainer} />
                  <Route path="/scan" component={ScannerContainer} />
                  <Route path="/pay" component={PayView} />
                  <Route path="/transfer" component={TransferView} />
                  <Route path="/createCertificate" component={CreateCertView}/>
                  <Redirect from="/" to="/home" />
                </Switch>
              </div>
              <LeftNavBar />
            </div>
          </HashRouter>
          <Modal
            open={ui.showModal}
            actions={ui.modalActions}
            uiActions={actions.ui}
            title={ui.modalTitle}/>
        </div>
      </MuiThemeProvider>
    );
  }
}

function mapStateToProps(state) {
  return {
    ui: state.ui,
    login: state.login,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      ui: bindActionCreators(uiActionCreators, dispatch),
      login: bindActionCreators(loginActionCreators, dispatch)

    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
