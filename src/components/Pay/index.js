import React, { Component }   from 'react';
import {Link}           from 'react-router-dom';
import {List, ListItem} from 'material-ui/List';
import {GridList, GridTile} from 'material-ui/GridList';
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

/* component styles */
import { styles } from './styles.scss';


const services = [
  {
    address: "0xe1cb660c6695531a8508cdd45351b4f71b296cbc",
    img: <ActionToc/>,
    title: 'Grab',
  },
  {
    address: "0xe1cb660c6695531a8508cdd45351b4f71b296cbc",
    img: <ActionToday/>,
    title: 'UBER',
  },
  {
    address: "0xe1cb660c6695531a8508cdd45351b4f71b296cbc",
    img: <ActionToll/>,
    title: 'Taxi',
  },
  {
    address: "0xe1cb660c6695531a8508cdd45351b4f71b296cbc",
    img: <ActionTouchApp/>,
    title: 'Gig',
  },
];

const mobile = [
  {
    address: "0xe1cb660c6695531a8508cdd45351b4f71b296cbc",
    img: <ActionTrackChanges/>,
    title: 'Maxis',
    
  },
  {
    address: "0xe1cb660c6695531a8508cdd45351b4f71b296cbc",
    img: <ActionTrendingDown/>,
    title: 'Celcom',
    
  },
  {
    address: "0xe1cb660c6695531a8508cdd45351b4f71b296cbc",
    img: <ActionTrendingFlat/>,
    title: 'U-Mobile',
    
  },
  {
    address: "0xe1cb660c6695531a8508cdd45351b4f71b296cbc",
    img: <ActionTurnedIn/>,
    title: 'Digi',
    
  },
];

const bills = [
  {
    address: "0xe1cb660c6695531a8508cdd45351b4f71b296cbc",
    img: <ActionTurnedInNot/>,
    title: 'Internet',
  },
  {
    address: "0xe1cb660c6695531a8508cdd45351b4f71b296cbc",
    img: <ActionUpdate/>,
    title: 'Water',
  },
  {
    address: "0xe1cb660c6695531a8508cdd45351b4f71b296cbc",
    img: <ActionTrendingFlat/>,
    title: 'Electricity',
  },
  {
    address: "0xe1cb660c6695531a8508cdd45351b4f71b296cbc",
    img: <ActionTrendingUp/>,
    title: 'Mobile',
  },
];

const shopping = [
  {
    address: "0xe1cb660c6695531a8508cdd45351b4f71b296cbc",
    img: <ActionShop/>,
    title: 'BeeZmall',
  },
  {
    address: "0xe1cb660c6695531a8508cdd45351b4f71b296cbc",
    img: <ActionShoppingBasket/>,
    title: 'Lazada',
  },
  {
    address: "0xe1cb660c6695531a8508cdd45351b4f71b296cbc",
    img: <ActionShoppingCart/>,
    title: '11street',
  },
  {
    address: "0xe1cb660c6695531a8508cdd45351b4f71b296cbc",
    img: <ActionShopTwo/>,
    title: 'Zalora',
  },
];

export default class PayComponent extends Component {
  constructor(props){
    super(props)
    this.state = {
      delay: 100,
      result: 'No result',
    }
  }
  clickPay(address) {
    this.props.history.push({
      pathname:"/transfer",
      state:{"recipient": address}
    })
  }
  render(){
    const previewStyle = {
      height: 600,
      width: 800,
      display:"inline"
    }

    var genGrid = (type) => {
      var that = this;
      return (<Grid style={{"paddingLeft":"16px"}} width={100}>
        {
          type.map((t, i)=>{
            return (<div key={i+t.title}>   
              <RaisedButton label={t.title}
                onClick={()=>{that.clickPay(t.address)}}
                labelPosition="before"
                primary={true}
                icon={t.img}
                fullWidth={true}
                style={{"margin":12}}/>                            
            </div>)
          })
        }          
      </Grid>);
    }
     
    return(
      <div>
        <Subheader>Services</Subheader>                      
        {genGrid(services)}
        <Subheader>Mobile</Subheader>
        {genGrid(mobile)}
        <Subheader>Bills</Subheader>
        {genGrid(bills)}
        <Subheader>Shopping</Subheader>
        {genGrid(shopping)}
      </div>
    )
  }
}