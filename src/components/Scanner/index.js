import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem } from 'material-ui/List';
import QrReader from 'react-qr-scanner'
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import web3 from 'web3';

import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
/* component styles */
import { styles } from './styles.scss';
import QRCode from 'qrcode-react';
import { RaisedButton } from 'material-ui';
const previewStyle = {
  width: 400,
  display: "inline"
}

export default class QRScanner extends Component {
  constructor(props) {
    super(props);

    // files uploaded
    // properties stored
    // value and details
    this.state = {
      certOwner: "",
      open: false,
      delay: 400,
    };

  }

  handleScan(data) {
    if (!data) return;

    if (web3.utils.isAddress(data)) {
      // dismiss
      // navigate to transfer page
      this.props.history.push({
        pathname:"/transfer",
        state:{"recipient": data}
      });      
    }
    this.setState({
      certOwner: data,
    })
  }
  handleError(err) {
    console.error(err)
  }

  deleteFile(fileName) {
    this.props.deleteFile(fileName);
  }

  handleClick = () => {
    this.refs.qrReader.openImageDialog();
  };
  render() {
    const previewStyle = {
      width: 400,
      display: "inline"
    }

    return (
      <Card expanded={true} onExpandChange={this.handleExpandChange}>
        <CardHeader
          title="iDinar Digital Pocket QR Scan"
          subtitle="Scan QR Code to transfer iDinar to their address"
          avatar="src/assets/images/idinar.jpg"
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText>
          Scan a QR Code to transfer some iDinar
        </CardText>
        <CardMedia
          expandable={true}
        >
          <div style={{ textAlign: "center" }}>
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
          </div>
        </CardMedia>
      </Card>
    )
  }
}