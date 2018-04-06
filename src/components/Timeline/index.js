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
import {Timeline, TimelineEvent} from 'react-event-timeline';

/* component styles */
import { styles } from './styles.scss';

const iconMap = {
  "SUBMITTED":<ActionTrackChanges/>,
  "VETTED":<ActionTranslate/>,
  "MINTED":<ActionUpdate/>,
  "REJECTED":<ActionTurnedInNot/>,
  "LOCKED":<ActionToc/>,
  "WITHDRAWN":<ActionTrendingFlat/>,
  "TRANSFER":<ActionShoppingCart/>,
  "PURCHASE":<ActionShoppingBasket/>,
  "ACCEPT":<ActionShop/>,
}
// MINTED
// VETTED
// SUBMITTED
// REJECTED
// LOCKED
// WITHDRAWN
// transfer (we transfered)
// purchase (we paid someone)
// accept (someone paid us)
const timelineEvents = [
  {
    "title":"Deposit Certificate <cert>",
    "date":"2017-09-21 10:32 PM",
    "type":"SUBMITTED",
    "message":"Certificate <123> Submitted for Vetting Process"
  },
  {
    "title":"Transfer Made 22 iDinar",
    "date":"2017-09-21 10:32 PM",
    "type":"TRANSFER",
    "message":"Transferred <22> iDinar to <abcde>"
  },
  {
    "title":"Purchase Made 12 iDinar",
    "date":"2017-09-21 10:32 PM",
    "type":"PURCHASE",
    "message":"Certificate <123> Submitted for Vetting Process"
  },
  {
    "title":"Acceppted 12 iDinar",
    "date":"2017-09-21 10:32 PM",
    "type":"ACCEPT",
    "message":"Certificate <123> Submitted for Vetting Process"
  },
  {
    "title":"Deposit Certificate <cert>",
    "date":"2017-09-21 10:32 PM",
    "type":"MINTED",
    "message":"Certificate <123> Minted - 24g at 24 iDinar, Deposited to <addr>"
  },{
    "title":"Vetted Certificate <cert>",
    "date":"2017-09-21 10:32 PM",
    "type":"VETTED",
    "message":"Certificate <123> Vetted - 24g at 24 iDinar"
  },
  {
    "title":"Submitted Certificate <cert>",
    "date":"2017-09-21 10:32 PM",
    "type":"SUBMITTED",
    "message":"Certificate <123> Submitted for Vetting Process"
  },


]

export default class TimelineComponent extends Component {
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

    return(
      <Timeline>
        {
          timelineEvents.map((x)=>{
            return (<TimelineEvent title={x.title}
                           createdAt={x.date}
                           icon={iconMap[x.type] ? iconMap[x.type] : <ActionTrendingFlat/>}
            >
                {x.message}
            </TimelineEvent>)
          })
        }
    </Timeline>
    )
  }
}