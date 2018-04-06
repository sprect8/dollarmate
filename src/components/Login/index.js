import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { Link } from 'react-router-dom';
import { List, ListItem } from 'material-ui/List';
import { GridList, GridTile } from 'material-ui/GridList';
import { FlatButton, TextField, AppBar, Paper, Subheader } from 'material-ui'
import Grid from 'react-css-grid';
import RaisedButton from 'material-ui/RaisedButton';
import ActionInfo from 'material-ui/svg-icons/action/info';
import lightwallet from 'eth-lightwallet';
import Avatar from 'material-ui/Avatar';
import FileFolder from 'material-ui/svg-icons/file/folder';
import ActionAssignment from 'material-ui/svg-icons/action/assignment';


/* component styles */
import { styles } from './styles.scss';

export default class LoginView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      delay: 100,
      result: 'No result',
      username: "",
      password: "",
      newSeed: localStorage.getItem("keyStore") ? false:true,
      addresses: [],
    }
  }
  render() {
    console.log("Hello", this.props);
    // view current balance and market value of iDinar (gold vs iDinar)
    // Transaction History
    // Certificates
    // Favourites

    /*console.log(this.props);
    if (localStorage.getItem("keyStore")) {
      this.props.actions.startup.login("Passwords");
    }
    else {
      this.props.actions.startup.register("critic pencil family inside odor cherry fault belt agent blood rather attract", "Passwords");
    }*/

    let addresses = this.props.addresses;
    let rolesObj = this.props.roles;
    let roles = {};

    rolesObj.forEach((r) => {
      roles[r.address] = r.role;
    })
    if (!addresses) addresses = [];
    if (!roles) roles = {};

    let roleMap = {
      0: "Custodian",
      2: "Founder",
      4: "Minter",
      8: "Vettor",
      99: "User",
      999: "Blacklisted"
    }

    return (
      <div>
        <MuiThemeProvider>
          <div>
            <AppBar
              title="Login"
            />            
            <div style={{"width": "600px", textAlign: "center", paddingTop:"12px"}} className="container">
              <div style={{"display":addresses.length == 0 ? "block" : "none"}}>
                <h2>{this.state.newSeed ? "Create New Account" : "Unlock existing account"}</h2>
                <TextField
                  hintText="Enter your Seed"
                  floatingLabelText="Seed"
                  fullWidth={true}
                  style={{display:(this.state.newSeed) ? "block":"none"}}
                  value={this.state.username}
                  onChange={(event, newValue) => this.setState({ username: newValue })}
                />                
                <TextField
                  type="password"
                  hintText="Enter your Password"
                  floatingLabelText="Password"
                  fullWidth={true}
                  onChange={(event, newValue) => this.setState({ password: newValue })}
                />
                <br />
                <RaisedButton label={this.state.newSeed ? "Submit" : "Unlock"} primary={true} 
                style={{ "marginTop": "12px", "marginBottom": "12px", "marginRight":"5px"}} 
                onClick={(event) => {
                  if (this.state.newSeed) {
                    this.props.actions.startup.register(this.state.username, this.state.password);
                  }
                  else {
                    this.props.actions.startup.login(this.state.password);                    
                  }
                }} />

                <RaisedButton label="New Seed" primary={true} style={{ "marginTop": "12px", "marginBottom": "12px", "marginRight":"5px" }}                 
                onClick={(event) => {this.setState({newSeed:true, username: ""}); localStorage.removeItem("keyStore")}} />

                <RaisedButton label="Generate Seed" primary={true} style={{ "marginTop": "12px", "marginBottom": "12px" }}                 
                onClick={(event) => this.setState({username: lightwallet.keystore.generateRandomSeed("entropy"), newSeed:true})} />


              </div>
              <div>
                <Paper>
                <List>
                    <Subheader>Choose a Registered Addresses</Subheader>
                    {
                      addresses.map((add)=>{
                        return (
                          <ListItem
                            key={add}
                            leftAvatar={<Avatar icon={<FileFolder />} />}
                            rightIcon={<ActionInfo />}
                            primaryText={add}
                            secondaryText={roleMap[roles[add]]}
                            onClick={(e)=>{this.props.actions.startup.useAddress(add);}}
                          />);
                      })
                    }
                  </List>
                </Paper>
              </div>
            </div>
          </div>
        </MuiThemeProvider>
      </div>
    )
  }
}