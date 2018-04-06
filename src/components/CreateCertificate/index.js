import React from 'react';
import { Link } from 'react-router-dom';

import FileUpload from 'material-ui/svg-icons/file/file-upload';
import { List, ListItem } from 'material-ui/List';
import ActionInfo from 'material-ui/svg-icons/action/info';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';

/* component styles */
import { styles } from './styles.scss';
import { RaisedButton, TextField, FlatButton, Dialog } from 'material-ui';
import ActionTrackChanges from 'material-ui/svg-icons/action/track-changes';

import Upload from 'material-ui-upload/Upload';
import web3 from 'web3';

import QrReader from 'react-qr-scanner'
import QRCode from 'qrcode-react';
import Swal from 'sweetalert2';

const ipfsAPI = require('ipfs-api')

console.log(web3.utils.isAddress("0x08125506d8e76dea6ac257e8c86636c9d1e57173"));
const previewStyle = {
    width: 400,
    display: "inline"
}

export default class CreateCertificate extends React.Component {

    constructor(props) {
        super(props);

        // files uploaded
        // properties stored
        // value and details
        this.state = {
            openUploadModal: false,
            files: [],
            certOwner: "",
            certAmount: 0,
            open: false,
            delay: 400,     
            fileHash: {},
            additionalProperties:[{key:"", value:""}, {key:"", value:""}, {key:"", value:""}]                   
        };

        this.ipfsApi = ipfsAPI('ipfs.infura.io', '5001', { 'protocol': 'https' });
        this.captureFile = this.captureFile.bind(this)
        this.saveToIpfs = this.saveToIpfs.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

    }

    handleScan(data) {        
        if (!data) return;

        if (web3.utils.isAddress(data)) {
            // dismiss
            this.handleClose();
        }
        this.setState({
            certOwner: data,
        })
    }
    handleError(err) {
        console.error(err)
    }

    closeDialog() {
        this.setState({ openUploadModal: false });
    }

    saveFiles(files) {
        //Saving files to state for further use and closing Modal.
        this.setState({ files: files, openUploadModal: false });
    }

    handleOpenUpload() {
        this.setState({
            openUploadModal: true,
        });
    }

    deleteFile(fileName) {
        this.props.deleteFile(fileName);
    }

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleClick = () => {
        this.refs.qrReader.openImageDialog();
    };

    submitCertificateToBlockChain = (hash) => {
        var owner = this.state.certOwner;
        var value = this.state.certAmount;
        console.log(owner, hash, value);
        this.props.contract.requestMintCoin(owner, hash, value, {from:this.props.coinbase, gas:400000, gasPrice:4000000}).then((r)=>{
            console.log(r);
            Swal('Successfully submitted certificate', 'Certificate submitted succesfully, please wait for validation ' + JSON.stringify(r), 'success')
            .then((result) => {
                this.props.history.push({
                    pathname: "/certificateList"
                })
            });
        }).catch( e =>{
            console.log(e);
            Swal('Failed to Submit iDinar Certificate', 'Something went wrong uploading certificate to IBadah! Error was ' + e, 'error');
        });
        
    }

    createCertificate = () => {
        // create the necessary properties
        // create the necessary ipfs entry as byte stream
        // upload the details to the smart contract

        console.log(this.state); // should have captured all the properties already
        let certificate = {
            owner: this.state.certOwner,
            amount: this.state.certAmount,
            files: this.state.fileHash,
            additionalProperties: this.state.additionalProperties
        }
        var buf = Buffer.from(JSON.stringify(certificate));
        this.ipfsApi.add(buf, { progress: (prog) => console.log(`received: ${prog}`) })
            .then((response) => {
                var ipfsId = response[0].hash                
                console.log("This is the filehash for the certificate: ", ipfsId);
                this.submitCertificateToBlockChain(ipfsId);
            }).catch((err) => {
                Swal('Error uploading certificate to IPFS', 'Something went wrong uploading certificate to IPFS! Error was ' + err, 'error');
            })
    }

    captureFile(event, key) {
        /*event.stopPropagation()
        event.preventDefault()
        */
        const file = event;//event.target.files[0]
        let reader = new window.FileReader()
        reader.onloadend = () => this.saveToIpfs(reader, key)
        reader.readAsArrayBuffer(file)

        //uriContent = "data:application/octet-stream," + encodeURIComponent(content);

    }

    saveToIpfs(reader, key) {
        let ipfsId
        const buffer = Buffer.from(reader.result)
        
        this.ipfsApi.add(buffer, { progress: (prog) => console.log(`received: ${prog}`) })
            .then((response) => {
                console.log(response)
                ipfsId = response[0].hash
                console.log(ipfsId)
                let hash = this.state.fileHash;
                hash[key] = ipfsId;

                this.setState({ fileHash:hash });
            }).catch((err) => {
                Swal('Error uploading file to IPFS', 'Something went wrong! Error was ' + err, 'error');
            })
    }

    handleSubmit(event) {
        event.preventDefault()
    }

    changeKey = (key, value) => {
        let st = this.state.additionalProperties;
        st[key].key = value;
        this.setState({additionalProperties: st});
    }

    changeValue = (key, value) => {
        let st = this.state.additionalProperties;
        st[key].value = value;
        this.setState({additionalProperties: st});
    }

    render() {
        // create certificate
        // 1. the file hashes
        // 2. the additional properties can combine with the hash files, user address, and amount
        // 3. upload that to ipfs to get the hash
        // 4. submit requestMintCoin(owner, hash, total coins)
        // 
        // show how much iDinar is grams gold worth

        let files = this.state.files;
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
                disabled={!web3.utils.isAddress(this.state.certOwner)}
                onClick={this.handleClose}
            />,
        ];

        return (
            <div>
                <h2><Avatar src="src/assets/images/idinar.jpg" size={30} /> Create iDinar Digital Certificate</h2>
                <br />
                <h3 style={{ textAlign: "center" }}>Custodian - {this.props.coinbase}</h3>
                <br />
                <form onSubmit={this.handleSubmit}>
                    <Card initiallyExpanded={true}>
                        <CardHeader
                            avatar={<Avatar
                                icon={<ActionTrackChanges />}
                                size={40} />}
                            title="Important Properties"
                            subtitle="Important mandatory properties to be supplied"
                            actAsExpander={true}
                            showExpandableButton={true}
                        />
                        <CardText expandable={true}>
                            <TextField
                                hintText="Owner of Certificate"
                                floatingLabelText="Certificate Owner"
                                floatingLabelFixed={true}
                                fullWidth={true}
                                value={this.state.certOwner}
                                onChange={(e)=>{this.setState({certOwner:e.target.value})}}
                            />
                            <RaisedButton label={"Scan"} onClick={this.handleOpen} />
                            <br />
                            <TextField
                                floatingLabelText="Total Resources"
                                hintText="Total Resources"
                                floatingLabelFixed={true}
                                value={this.state.certAmount}
                                onChange={(e)=>{this.setState({certAmount:e.target.value})}}
                            />
                        </CardText>
                    </Card>
                    <br />
                    <Divider />
                    <br />
                    <Card initiallyExpanded={true}>
                        <CardHeader
                            avatar={<Avatar
                                icon={<ActionTrackChanges />}
                                size={40} />}
                            title="Supporting Documents"
                            subtitle="Upload supporting documents for the iDinar certificate"
                            actAsExpander={true}
                            showExpandableButton={true}
                        />
                        <CardText expandable={true}>
                            <TextField
                                floatingLabelText="Property Name"
                                hintText="Custodian"
                                floatingLabelFixed={true}
                                disabled
                                value={this.state.custodian ? this.state.custodian.name : ""}
                            />                   
                            
                            <Upload label="Upload" onFileLoad={(e, file) => { this.captureFile(file, "custodian"); this.setState({ custodian: file }); }} />
                            <br />
                            <TextField
                                hintText="Verifier"
                                floatingLabelFixed={true}
                                disabled
                                value={this.state.verifier ? this.state.verifier.name : ""}
                            />
                            <Upload label="Upload" onFileLoad={(e, file) => { this.captureFile(file, "verifier"); this.setState({ verifier: file }); }}  />
                            <br />
                            <TextField
                                hintText="Sayer"
                                floatingLabelFixed={true}
                                disabled
                                value={this.state.sayer ? this.state.sayer.name : ""}
                            />
                            <Upload label="Upload" onFileLoad={(e, file) => { this.captureFile(file, "sayer"); this.setState({ sayer: file }); }} />
                        </CardText>
                    </Card>
                    <br />
                    <Divider />
                    <br />
                    <Card initiallyExpanded={false}>
                        <CardHeader
                            avatar={<Avatar
                                icon={<ActionInfo />}
                                size={40} />}
                            title="Additional Properties"
                            subtitle="Add additional properties to the iDinar certificate"
                            actAsExpander={true}
                            showExpandableButton={true}
                        />
                        <CardText expandable={true}>
                            <TextField
                                hintText="Name"
                                floatingLabelText="Property Name"
                                floatingLabelFixed={true}
                                value={this.state.additionalProperties[0].key}                                
                                onChange={(e)=>{this.changeKey(0, e.target.value)}}
                            />
                            <TextField
                                hintText="Value"
                                floatingLabelText="Property Value"
                                floatingLabelFixed={true}
                                value={this.state.additionalProperties[0].value}
                                onChange={(e)=>{this.changeValue(0, e.target.value)}}    
                            />
                            <br />
                            <TextField
                                hintText="Name"
                                floatingLabelText="Property Name"
                                floatingLabelFixed={true}
                                value={this.state.additionalProperties[1].key}
                                onChange={(e)=>{this.changeKey(1, e.target.value)}}
                            />
                            <TextField
                                hintText="Value"
                                floatingLabelText="Property Value"
                                floatingLabelFixed={true}
                                value={this.state.additionalProperties[1].value}
                                onChange={(e)=>{this.changeValue(1, e.target.value)}}    
                            />
                            <br />
                            <TextField
                                hintText="Name"
                                floatingLabelText="Property Name"
                                floatingLabelFixed={true}
                                value={this.state.additionalProperties[2].key}
                                onChange={(e)=>{this.changeKey(2, e.target.value)}}
                            />
                            <TextField
                                hintText="Value"
                                floatingLabelText="Property Value"
                                floatingLabelFixed={true}
                                value={this.state.additionalProperties[2].value}
                                onChange={(e)=>{this.changeValue(2, e.target.value)}}    
                            />
                        </CardText>
                    </Card>
                    <br />
                    <RaisedButton label={"Create Certificate"} primary={true} onClick={this.createCertificate}/>
                    <Dialog
                        title="Scan address details"
                        actions={actions}
                        modal={false}
                        open={this.state.open}
                        onRequestClose={this.handleClose}
                    >
                        <h3>Scan a users' address</h3>
                        <h4>{this.state.certOwner}</h4>
                        <QrReader
                            showViewFinder={true}
                            delay={this.state.delay}
                            style={previewStyle}
                            onError={this.handleError.bind(this)}
                            onScan={this.handleScan.bind(this)}
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
                </form>
            </div>
        );
    }
}