import React from 'react';
import { Drawer as MuiDrawer } from 'material-ui';
import { Link } from 'react-router-dom';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import FileFolder from 'material-ui/svg-icons/file/folder';
import IconButton from 'material-ui/IconButton';

import ActionSwapVerticalCircle from 'material-ui/svg-icons/action/swap-vertical-circle';
import ActionZoomIn from 'material-ui/svg-icons/action/zoom-in';
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
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';

export default class CertificateList extends React.Component {
  constructor(props) {
    super(props);
    this.currentIndex = 100;
    this.loadingMore = false;
    this.currentCertificates = [];
    this.seenCerts = {};
  }

  componentDidMount() {    
    this.props.actions.cert.fetchCertificates(this.currentIndex);

  }

  loadMore() {
    this.props.actions.cert.fetchCertificates(this.currentIndex);
    this.loadingMore = true;
  }

  // generate some fake certificates
  /*let certificates = [
    {type:"iDinar", status:"ACTIVE", totalDinar:"24", totalResource:"35g", },
    {type:"iDinar", status:"ACTIVE", totalDinar:"24", totalResource:"35g", },
    {type:"iDinar", status:"PENDING VETTER", totalDinar:"24", totalResource:"35g", },
    {type:"iDinar", status:"PENDING MINTER", totalDinar:"24", totalResource:"35g", },
    {type:"iDinar", status:"INACTIVE", totalDinar:"24", totalResource:"35g", }
  ]*/
  render() {
    var props = this.props;
    console.log(props, "CERT");

    let certificates = props.certificates ? props.certificates : [];
    certificates.forEach(c=>{
      if (!this.seenCerts[c.id]) {
        this.currentCertificates.push(c);
        this.currentIndex ++;
        this.seenCerts[c.id] = 1;
      }      
    })
    certificates = this.currentCertificates;
    return (
      <div>
        <Table
          fixedHeader={true}
          selectable={true}
        >
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}

          >
            <TableRow>
              <TableHeaderColumn tooltip="Digital Certificate Type">Certificate</TableHeaderColumn>
              <TableHeaderColumn tooltip="Current Status">Status</TableHeaderColumn>
              <TableHeaderColumn tooltip="Total iDinar">Total iDinar</TableHeaderColumn>
              <TableHeaderColumn tooltip="Actions">Actions</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={false}
          >
            {
              certificates.map((x, i) => {
                return <TableRow key={i}>
                  <TableRowColumn><img style={{ "height": "36px" }} src="src/assets/images/idinar.jpg" /><br />iDinar[{x.id}]</TableRowColumn>
                  <TableRowColumn>{x.status}</TableRowColumn>
                  <TableRowColumn>{x.totalDinar}</TableRowColumn>
                  <TableRowColumn>
                    <Link to={{ pathname: "/certificateView", state: { "address": x.id } }}><ActionZoomIn /></Link>
                  </TableRowColumn>
                </TableRow>
              })
            }            
          </TableBody>
        </Table>
        <RaisedButton label={"Load More"} primary={true} onClick={this.loadMore.bind(this)}/>
      </div>
    );
  }
}