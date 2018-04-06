import React, { Component }   from 'react';
import {Link}           from 'react-router-dom';
import {List, ListItem} from 'material-ui/List';
import {GridList, GridTile} from 'material-ui/GridList';
import {Tabs, Tab} from 'material-ui/Tabs';
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
import ActionTurnedIn  from 'material-ui/svg-icons/action/turned-in';
import ActionTurnedInNot from 'material-ui/svg-icons/action/turned-in-not';
import ActionUpdate from 'material-ui/svg-icons/action/update';
import RaisedButton from 'material-ui/RaisedButton';
import CertificateList from '../CertificateList';
import TimelineComponent from '../Timeline';


/* component styles */
import { styles } from './styles.scss';

export default class HomeComponent extends Component {
  constructor(props){
    super(props)
    this.state = {
      delay: 100,
      result: 'No result',
    }
  }
  render(){
    // view current balance and market value of iDinar (gold vs iDinar)
    // Transaction History
    // Certificates
    // Favourites

    console.log(this.props);
    
    return(
      <div>
        <div style={{textAlign:"center"}}>                
        <h2>iDinar Balance - {this.props.iDinar.toString()}</h2>
        <Subheader>{this.props.coinbase}</Subheader>
        </div>
        <Tabs>
          <Tab
            icon={<ActionUpdate/>}
            label="Account"
          >
            <TimelineComponent/>          
          </Tab>
          <Tab
            icon={<ActionTouchApp/>}
            label="Certificates"
          >
            <CertificateList {...this.props}/>
          </Tab>

        </Tabs>       
      </div>
    )
  }
}