import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem } from 'material-ui/List';
import { GridList, GridTile } from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import Grid from 'react-css-grid';
import ActionShop from 'material-ui/svg-icons/action/shop';
import ActionShopTwo from 'material-ui/svg-icons/action/shop-two';
import ActionShoppingBasket from 'material-ui/svg-icons/action/shopping-basket';
import ActionShoppingCart from 'material-ui/svg-icons/action/shopping-cart';
import ActionToc from 'material-ui/svg-icons/action/toc';
import ActionToday from 'material-ui/svg-icons/action/today';
import ActionToll from 'material-ui/svg-icons/action/toll';
import ActionTouchApp from 'material-ui/svg-icons/action/touch-app';
import ActionTrackChanges from 'material-ui/svg-icons/action/track-changes';
import ActionTranslate from 'material-ui/svg-icons/action/translate';
import ActionTrendingDown from 'material-ui/svg-icons/action/trending-down';
import ActionTrendingFlat from 'material-ui/svg-icons/action/trending-flat';
import ActionTrendingUp from 'material-ui/svg-icons/action/trending-up';
import ActionTurnedIn from 'material-ui/svg-icons/action/turned-in';
import ActionTurnedInNot from 'material-ui/svg-icons/action/turned-in-not';
import ActionUpdate from 'material-ui/svg-icons/action/update';
import RaisedButton from 'material-ui/RaisedButton';
import QrReader from 'react-qr-scanner'
import web3 from 'web3';
/* component styles */
import { styles } from './styles.scss';
import { FlatButton, TextField } from 'material-ui';
import Dialog from 'material-ui/Dialog/Dialog';
import swal from 'sweetalert2'

const previewStyle = {
  width: 400,
  display: "inline"
}

export default class TransferComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      openUploadModal: false,
      recipient: "",
      open: false,
      delay: 400,
      value: 0
    };
  }

  handleScan(data) {
    if (!data) return;

    if (web3.utils.isAddress(data)) {
      // dismiss
      this.handleClose();
    }
    this.setState({
      recipient: data,
    })
  }
  handleError(err) {
    console.error(err)
  }

  closeDialog() {
    this.setState({ openUploadModal: false });
  }

  handleOpenUpload() {
    this.setState({
      openUploadModal: true,
    });
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleClick() {
    this.refs.qrReader.openImageDialog();
  };

  transfer() {
    // confirm transfer x amount to address
    swal({
      title: 'Are you sure?',
      text: "Confirm trainsfer to address [" + this.state.recipient + "] a total of [" + this.state.value + "] iDinar (note this cannot be undone)!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Send it!'
    }).then((result) => {
      if (result.value) {
        // delete
        this.props.actions.acc.sendIDinar(this.props.coinbase, this.state.recipient, this.state.value);
        /*swal(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )*/
      }
    });
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        disabled={!web3.utils.isAddress(this.state.recipient)}
        onClick={this.handleClose}
      />,
    ];

    let st = this.state;

    if (this.state.recipient) {
      st = this.state;
    }
    else if (this.props.location && this.props.location.state) {
      // st = this.props.location.state;
      var that = this;
      window.setTimeout(function(){
        that.setState({
          recipient: that.props.location.state.recipient,
          value: that.props.location.value ? +that.props.location.state.value : 0
        });
      }, 100);
    }

    return (
      <div>
        <TextField
          hintText="Recipient"
          floatingLabelText="Recipient of iDinar"
          floatingLabelFixed={true}
          value={st.recipient ? st.recipient : ""}
          fullWidth={true}
          onChange={(e)=>{this.setState({recipient:e.target.value})}}
        /><FlatButton label="Scan" primary={true} icon={<ActionTouchApp />}  onClick={this.handleOpen.bind(this)}/><br />
        <TextField
          hintText="Account"
          floatingLabelText="Account to send from"
          floatingLabelFixed={true}
          fullWidth={true}
          value={this.props.coinbase}
        /><br />
        <TextField
          hintText="Amount"
          floatingLabelText="Amount to Send"
          floatingLabelFixed={true}
          value={st.value ? st.value : 0}
          type="number"
          onChange={e=>{this.setState({value:e.target.value})}}
          fullWidth={true}
        /><br />
        <RaisedButton label="Transfer" icon={<ActionShoppingCart />} secondary={true} 
                      disabled={(st.recipient == null || !web3.utils.isAddress(st.recipient)) || (!st.value || st.value <= 0)}
                      onClick={this.transfer.bind(this)}/>
        <Dialog
          title="Scan address details"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <h3>Scan a users' address</h3>
          <h4>{this.state.recipient}</h4>
          <QrReader
            showViewFinder={true}
            delay={this.state.delay}
            style={previewStyle}
            onError={this.handleError.bind(this)}
            onScan={this.handleScan.bind(this)}
            facingMode="rear"
          />

          <QrReader
            showViewFinder={true}
            delay={this.state.delay}
            legacyMode
            onError={this.handleError.bind(this)}
            onScan={this.handleScan.bind(this)}
            ref="qrReader"
          />

          <RaisedButton label="Load from Device" onClick={this.handleClick.bind(this)} />
        </Dialog>
      </div>
    )
  }
}