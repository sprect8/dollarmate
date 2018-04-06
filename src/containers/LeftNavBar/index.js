import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { Drawer, AppBar } from 'material-ui';
import { appConfig } from 'core/configs/config-app';
import { List, ListItem } from 'material-ui/List';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import ContentSend from 'material-ui/svg-icons/content/send';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import EuroSymbol from 'material-ui/svg-icons/action/euro-symbol';
import ActionNoteAdd from 'material-ui/svg-icons/action/note-add';
import ActionPayment from 'material-ui/svg-icons/action/payment';
import ActionAccountBalanceWallet from 'material-ui/svg-icons/action/account-balance-wallet';
import MapsBeenHere from 'material-ui/svg-icons/maps/beenhere';
import ContentContentCopy from 'material-ui/svg-icons/content/content-copy';
import ActionOpenInBrowser from 'material-ui/svg-icons/action/open-in-browser';
import {register, login, useAddress} from '../../core/actions/actions-login'
/* component styles */
import { styles } from './styles.scss';

/* actions */
import * as uiActionCreators from 'core/actions/actions-ui';

class LeftNavBar extends Component {
  constructor(props) {
    super(props);
  }

  closeNav = () => {
    this.props.actions.ui.closeLeftNav();
  }

  navigateTo = (locn, st) => {
    if (st) {
      locn = locn + "/" + st.type;
    }
    this.props.history.push({
      pathname: locn,
      state: st
    })
  }

  render() {
    console.log("LeftNavBar", this.props)
    var userType = 1;

    if (this.props.userType) {
      userType = this.props.userType
    }

    console.log(userType);

    var isBank = userType == 0;
    var isVetter = userType == 8;
    var isMinter = userType == 4;
    var isUser = userType == 99;
    var isMerchant = userType == 99;
    
    var that = this;

    var name = "Custodian";
    if (isVetter) name = "Vetter";
    if (isMinter) name = "Minter";
    if (isUser) name = "User";
    if (isMerchant) name = "Merchant";

    return (
      <div className={styles} >
        <Drawer
          docked={false}
          disableSwipeToOpen={true}
          open={this.props.ui.leftNavOpen}
          onRequestChange={this.closeNav}>
          <AppBar title={name} />
          <List>
            <ListItem primaryText="Home" leftIcon={<ContentInbox />} onClick={() => { that.navigateTo("/home") }} />
            <ListItem primaryText="Create Certificate"
              leftIcon={<ActionNoteAdd />} 
              onClick={()=>{that.navigateTo("/createCertificate")}}
              style={{ display: isBank ? "block" : "none" }} />
            
            <ListItem primaryText="View Pending Vetting" 
            leftIcon={<ActionGrade />} 
            onClick={()=>{that.navigateTo("/certificateList", {"type":"PENDING_VETTING"})}}
            style={{ display: !isMerchant && !isUser ? "block" : "none" }} />
            
            <ListItem primaryText="View Pending Minting" 
            leftIcon={<ActionGrade />} 
            onClick={()=>{that.navigateTo("/certificateList", {"type":"PENDING_MINTING"})}}
            style={{ display: !isMerchant && !isUser ? "block" : "none" }} />
            
            <ListItem primaryText="View Rejected Certificate" 
            leftIcon={<ContentSend />} 
            onClick={()=>{that.navigateTo("/certificateList", {"type":"REJECTED"})}}
            style={{ display: !isMerchant && !isUser ? "block" : "none" }} />
            
            <ListItem primaryText="View Approved Certificate" 
            leftIcon={<ContentDrafts />} 
            onClick={()=>{that.navigateTo("/certificateList", {"type":"VALID"})}}
            style={{ display: !isMerchant && !isUser ? "block" : "none" }} />
            
            <ListItem primaryText="Services" leftIcon={<MapsBeenHere />}
              initiallyOpen={false}
              primaryTogglesNestedList={true}
              style={{ display: isUser || isMerchant ? "block" : "none" }}
              nestedItems={[
                <ListItem style={{ display: isUser || isMerchant ? "block" : "none" }} key="1" primaryText="Payments" leftIcon={<ActionPayment />} onClick={() => { that.navigateTo("/pay") }} />,
                <ListItem style={{ display: isUser || isMerchant ? "block" : "none" }} key="2" primaryText="Transfers" leftIcon={<ContentContentCopy />} onClick={() => { that.navigateTo("/transfer") }} />,
              ]} />
            <ListItem primaryText="Assets" leftIcon={<ContentInbox />}
              style={{ display: isUser || isMerchant ? "block" : "none" }}
              initiallyOpen={false}
              primaryTogglesNestedList={true}
              nestedItems={[
                <ListItem style={{ display: isUser || isMerchant ? "block" : "none" }} key="4" primaryText="iDinar Cert" leftIcon={<EuroSymbol />} onClick={() => { that.navigateTo("/certificateList") }} />
              ]}
            />
          </List>
        </Drawer>
      </div>
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
    ui: state.ui,
    addresses: state.login.addresses,
    roles: state.login.roles,
    coinbase: state.login.coinbase,
    userType: state.login.userType,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      ui: bindActionCreators(uiActionCreators, dispatch),
      startup: bindActionCreators(actions, dispatch),
    }
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LeftNavBar));
