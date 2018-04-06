import React            from 'react';
import {Link}           from 'react-router-dom';
import {List, ListItem} from 'material-ui/List';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import ActionNoteAdd    from 'material-ui/svg-icons/action/note-add'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import NavigationCancel from 'material-ui/svg-icons/navigation/cancel';
import EditorAttachMoney from 'material-ui/svg-icons/editor/attach-money';
import swal from 'sweetalert2'
import constants from 'core/types';
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


export default class CertificateView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      expanded: true,
    };
  }
 
  hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
  }

  loadDocuments = () => {

    var conn = this.hex2a(this.props.certificate.supportingDocs)
    conn = conn.substr(1);

    fetch("https://ipfs.io/ipfs/" + conn).then(result => {      
      return result.json();
    })
    .then((result) => {
      console.log("IPFS Result is ", result);
      this.setState({"support": result});
    })
    .catch((e)=>{
      console.log("Error", e);
    });
  }

  handleExpandChange = (expanded) => {
    this.setState({expanded: expanded});
  };

  handleToggle = (event, toggle) => {
    this.setState({expanded: toggle});
  };

  handleExpand = () => {
    this.setState({expanded: true});
  };

  handleReduce = () => {
    this.setState({expanded: false});
  };

  rejectCoin = () => {
    swal({
      title: 'Are you sure?',
      text: "Confirm Rejecting certificate with id " + this.props.certificate.certId + " (note this cannot be undone)! (" + this.props.certificate.totalResources + " grams)",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, reject it!'
    }).then((result) => {
      if (result.value) {
        // delete
        this.props.actions.cert.rejectCertificate(this.props.certificate.certId);
        /*swal(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )*/
      }
    });
  }

  vetCoin = () => {
    var params = {
      title: 'Are you sure?',
      text: "Confirm Vetting certificate with id " + this.props.certificate.certId + " (" + this.props.certificate.totalResources + " grams)",
      type: 'warning',      
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Vet It!',
      inputValidator: (value) => {
        return !value && 'Please enter a value for the total dinar!'
      }
    }

    if (this.props.certificate.totalDinar == 0) {
      params.input = "number";
      // call web service to retrieve the current rate of the iDinar
      params.inputValue = +this.props.certificate.totalResources; // this is the default 1 to 1 mapping
    }

    swal(params).then((result) => {
      if (result.value) {        
        var value = result.value;
        if (this.props.certificate.totalDinar > 0) {
          value = this.props.certificate.totalDinar;
        }
        this.props.actions.cert.vetCertificate(this.props.certificate.certId, value);        
      }
    });
  }

  mintCoin = () => {
    swal({
      title: 'Are you sure?',
      text: "Confirm Mint certificate with id " + this.props.certificate.certId + " (" + 
              this.props.certificate.totalResources + " grams) @ (" + this.props.certificate.totalDinar + " iDinar)",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Mint it!'
    }).then((result) => {
      if (result.value) {
        this.props.actions.cert.mintCertificate(this.props.certificate.certId);        
      }
    });
  }

  render() {
    console.log(this.props);
    if (this.props.type == constants.CERT_VETTED || this.props.type == constants.CERT_MINTED || this.props.type == constants.CERT_REJECTED) {
      this.props.history.push({
        pathname: "/certificateList"
      });
      return <div></div>;
    }


    if (!this.props.certificate) {
      return (<RefreshIndicator
      size={50}
      left={70}
      top={0}
      loadingColor="#FF9800"
      status="loading"
      //style={style.refresh}
    />)
    }
    if (!this.state.support)
      this.loadDocuments();
/*
    certId: id.toString(),
                custodian: custodian,
                supportingDocs: supportingDocument,
                owner: owner,
                totalDinar: supply.toString(),
                status: getStatus(status),
                totalResources : totalResources.toString()*/

    var certificate = this.props.certificate;
    var status = "Minted with - ";
    if (certificate.status == "PENDING_VET") {
      status = "Awaiting Vetters ("  + certificate.required + ")- "
    }
    else if (certificate.status == "PENDING_MINT") {
      status = "Awaiting Minters ("  + certificate.required + ")- "
    }
    else if (certificate.status == "REJECTED") {
      status = "Certificate Rejected - ";
    }    

    let controls = [];

    console.log(this.props);
    var userType = this.props.userType;

    var isBank = userType == 0;
    var isVetter = userType == 8;
    var isMinter = userType == 4;
    var isUser = userType == 99;
    var isMerchant = userType == 99;

    if (isVetter && certificate.status == "PENDING_VET") {
      controls.push(<TableRow key = "17">
      <TableRowColumn>Actions [Vetter]</TableRowColumn>
      <TableRowColumn>
        <FloatingActionButton style={{"margin":"6px"}} onClick={this.vetCoin}>
          <ActionNoteAdd />
        </FloatingActionButton>        
        <FloatingActionButton style={{"margin":"6px"}} secondary={true} onClick={this.rejectCoin}>
          <NavigationCancel />
        </FloatingActionButton>        
      </TableRowColumn>
    </TableRow>)

    } 
    else if (isMinter && certificate.status == "PENDING_MINT") {
      controls.push(<TableRow key = "17">
      <TableRowColumn>Actions [Minter]</TableRowColumn>
      <TableRowColumn>
        <FloatingActionButton style={{"margin":"6px"}} onClick={this.mintCoin}>
          <EditorAttachMoney />
        </FloatingActionButton>        
        <FloatingActionButton style={{"margin":"6px"}} secondary={true} onClick={this.rejectCoin}>
          <NavigationCancel />
        </FloatingActionButton>        
      </TableRowColumn>
    </TableRow>);
    }

    // depending on user, i will have Minting and Vetting buttons here as well
    // and we can (if we are minter) 
    // can reject coin. so actions are Reject, Clear Vetting, Approve Mint
    // refresh on click of Reject, Clear, Approve

    return (
      <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
        <CardHeader
          title="iDinar Digital Certificate"
          subtitle={status + " " + certificate.totalDinar + " iDinar @ " + certificate.totalResources + " grams @ 1 iDinar per gram"}
          avatar="src/assets/images/idinar.jpg"
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText>
          
          This iDinar Digital Certificate is certified for {certificate.owner}
          
        </CardText>
        <CardMedia
          expandable={true}
          overlay={<CardTitle title={"iDinar Certificate No "+certificate.certId} subtitle={"Owner - " + certificate.owner + ", " + certificate.totalDinar + " iDinar @ " + certificate.totalResources + " grams"} />}
        >
          <img src="src/assets/images/OPOSN00.jpg" alt="" />
        </CardMedia>
        <CardTitle title={"Total value - " + certificate.totalDinar + " iDinar @ " + certificate.totalResources + " Grams"} subtitle={"Status - " + certificate.status} expandable={true} />
        <CardText expandable={true}>
          <div>
            <Table
              fixedHeader={true}              
              selectable={false}              
            >
              <TableBody>
                <TableRow key = "1">
                  <TableRowColumn>Certificate Owner</TableRowColumn>
                  <TableRowColumn>[{certificate.owner}]</TableRowColumn>
                </TableRow>
                <TableRow key = "2">
                  <TableRowColumn>Create by Custodian</TableRowColumn>
                  <TableRowColumn>[{certificate.custodian}]</TableRowColumn>
                </TableRow>                
                <TableRow key = "8">
                  <TableRowColumn>Supporting Documents</TableRowColumn>
                  <TableRowColumn>
                  
                    Source: [<a target="_blank" href={"https://ipfs.io/ipfs/"+this.hex2a(certificate.supportingDocs).substr(1)}>Source Data</a>]<br/>
                    [{this.state.support ? this.state.support.owner : ""}] Owner<br/>
                    [{this.state.support ? this.state.support.amount : ""}] grams Gold<br/>
                    [<a target="_blank" href={"https://ipfs.io/ipfs/"+(this.state.support ? this.state.support.files.custodian : "")}>Custodian</a>]<br/>
                    [<a target="_blank" href={"https://ipfs.io/ipfs/"+(this.state.support ? this.state.support.files.verifier : "")}>Verifier</a>]<br/>
                    [<a target="_blank" href={"https://ipfs.io/ipfs/"+(this.state.support ? this.state.support.files.sayer : "")}>Sayer</a>]<br/>
                    Properties: 
                    {
                      this.state.support ? this.state.support.additionalProperties.filter(x=>{return x.key.length > 0;}).map((res) => {                        
                        return <div>{res.key} : {res.value}</div>
                      }):null
                    }


                  </TableRowColumn>
                </TableRow>
                {
                  controls
                }   
                <TableRow key = "4">
                  <TableRowColumn>Status</TableRowColumn>
                  <TableRowColumn>[{certificate.status}]</TableRowColumn>
                </TableRow>              
                <TableRow key = "5">
                  <TableRowColumn>Total Grams</TableRowColumn>
                  <TableRowColumn>{certificate.totalResources}</TableRowColumn>
                </TableRow>
                <TableRow key = "6">
                  <TableRowColumn>Total iDinar Minted</TableRowColumn>
                  <TableRowColumn>{certificate.totalDinar == 0 ? "Awaiting initial Vetter" : certificate.totalDinar}</TableRowColumn>
                </TableRow>
                <TableRow key = "12">
                  <TableRowColumn>Required Approvers</TableRowColumn>
                  <TableRowColumn>{certificate.required}</TableRowColumn>
                </TableRow>                
                <TableRow key = "7">
                  <TableRowColumn>Current Market Value</TableRowColumn>
                  <TableRowColumn>0.3 iDinar / gram (+66%)</TableRowColumn>
                </TableRow>                
              </TableBody>
            </Table>
          </div>
        </CardText>
      </Card>
    );
  }
}