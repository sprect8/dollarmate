import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { appConfig } from 'core/configs/config-app';
import AppBar from 'components/AppBar';
import { Tabs, Tab } from 'material-ui/Tabs';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import FontIcon from 'material-ui/FontIcon';
import CommunicationSpeakerPhone from 'material-ui/svg-icons/communication/speaker-phone';
import ActionAccountBalanceWallet from 'material-ui/svg-icons/action/account-balance-wallet';
import ActionNoteAdd from 'material-ui/svg-icons/action/note-add';
import ActionHome from 'material-ui/svg-icons/action/home';
import ActionSettingsOverscan from 'material-ui/svg-icons/action/settings-overscan';
import ActionCardGiftcard from 'material-ui/svg-icons/action/card-giftcard';
import ActionDashboard from 'material-ui/svg-icons/action/dashboard'
import {register, login, useAddress, logout} from '../../core/actions/actions-login'
import Swal from 'sweetalert2'
/* actions */
import * as uiActionCreators from 'core/actions/actions-ui';
import * as accActionCreators from 'core/actions/actions-accounts';

/* component styles */
import { styles } from './styles.scss';
import { FlatButton, RaisedButton } from 'material-ui';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myEth: 0,
      myIdinar: 0,
    }
    console.log(props);

    /*if (props.userType == 99) {
      props.contract.balanceOf.call(props.coinbase).then((result)=>{        
        this.setState({myIdinar:result.toString()})
      })
    }
    
    document.globalWeb3.eth.getBalance(props.coinbase, (e, result)=>{
      console.log(e, result);
      let balance = web3.fromWei(result);

      this.setState({myEth:balance.toString()})
    });*/    
  }

  componentDidMount = () => {
    if (this.props.userType == 99) {
      this.props.actions.acc.fetchIDinarBalance(this.props.coinbase);
    }
    this.props.actions.acc.fetchEthBalance(this.props.coinbase);
  }

  componentWillReceiveProps = (props) => {
    /*if (document.globalWeb3) {
      
    }*/
    
  }

  handleToggle = () => {
    this.props.actions.ui.openLeftNav();
  }

  navigateTo = (tab) => {
    this.props.history.push({
      pathname: tab.props['data-route']
    })
  }

  getToolbar = (isUser) => {
    if (isUser) {
      return (<div><FlatButton style={{"color": "white"}} label={"My Eth: " + this.props.balance} /> 
      <FlatButton style={{"color": "white"}} label={"Bal: " + (this.props.iDinar ? this.props.iDinar.toString() : 0)} /><RaisedButton label="Logout" style={{"color": "white"}} onClick={this.props.actions.startup.logout}/></div>)
    }
    else {
      return (<div><FlatButton style={{"color": "white"}} label={"My Eth: " + this.props.balance} /><RaisedButton label="Logout" style={{"color": "white"}} onClick={this.props.actions.startup.logout}/></div>);
    }    
  }

  render() {
    let title = "Home";

    if (this.props.location && this.props.location.pathname) {
      title = this.props.location.pathname;

      console.log("tile is ", title, title.indexOf("/", 1))
      if (title.indexOf("/", 1) > 0) {
        title = title.substring(0, title.indexOf("/", 1));
      }
      title = title.replace(/\//g, "");
      title = title[0].toUpperCase() + title.substring(1);
      title = title.replace("*", "");
    }

    console.log(this.props)

    var userType = this.props.userType;

    var isBank = userType == 0;
    var isVetter = userType == 8;
    var isMinter = userType == 4;
    var isUser = userType == 99;
    var isMerchant = userType == 99;
    
    var items = [];
    if (isBank || isVetter || isMinter) {
      if (isBank) {
        items.push(
          <Tab
            icon={<ActionNoteAdd />}
            label="Create"
            data-route="/createCertificate"
            onActive={this.navigateTo}
          />);
      }

      items.push(
        <Tab
          icon={<ActionSettingsOverscan />}
          label="Pending"
          data-route="/certificateList/PENDING"
          onActive={this.navigateTo}
        />);

      items.push(<Tab
        icon={<ActionCardGiftcard />}
        label="Complete"
        data-route="/certificateList/ACTIVE"
        onActive={this.navigateTo}
      />);

      items.push(<Tab
        icon={<ActionDashboard />}
        label="Rejected"
        data-route="/certificateList/REJECTED"
        onActive={this.navigateTo}

      />);
    }

    if (isUser || isMerchant) {
      items.push(<Tab
        icon={<CommunicationSpeakerPhone />}
        label="Scan"
        data-route="/scan"
        onActive={this.navigateTo}
        style={{ display: isUser || isMerchant ? "block" : "none" }}
      />);
      items.push(<Tab
        icon={<ActionNoteAdd />}
        label="Pay"
        data-route="/pay"
        onActive={this.navigateTo}
        style={{ display: isUser || isMerchant ? "block" : "none" }}
      />);
      items.push(<Tab
        icon={<ActionAccountBalanceWallet />}
        label="Accept"
        data-route="/collect"
        onActive={this.navigateTo}
        style={{ display: isUser || isMerchant ? "block" : "none" }}
      />);
    }

    return (
      <div className={styles}>
        <header>
          <AppBar
            title={title}
            onLeftIconButtonTouchTap={this.handleToggle}
            iconElementRight={this.getToolbar(isUser)}>
          </AppBar>
          <Tabs initialSelectedIndex={-1}>

            <Tab
              icon={<ActionHome />}
              label="Home"
              data-route="/home"
              onActive={this.navigateTo}
            />
            {items}
          </Tabs>
        </header>
      </div>
    );

  }
}

var actions = {
  register: register, 
  login: login,
  logout: logout,
  useAddress: useAddress
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
      startup: bindActionCreators(actions, dispatch),
      acc: bindActionCreators(accActionCreators, dispatch),
    }
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
