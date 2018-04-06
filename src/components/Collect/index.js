import React            from 'react';
import {Link}           from 'react-router-dom';
import {List, ListItem} from 'material-ui/List';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
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

export default class CollectView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      expanded: true,
    };
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

  render() {
    console.log(this.props);
    if (!this.props.coinbase) {
      return <div></div>
    }
    
    return ( 
      <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
        <CardHeader
          title={"iDinar Digital Pocket "+this.props.coinbase}
          subtitle="This is your Digital Pocket, have others scan to send you some iDinar!"
          avatar="src/assets/images/idinar.jpg"
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText>          
          <div>Current Balance : {this.props.iDinar.toString()} iDinar</div>
        </CardText>
        <CardMedia
          expandable={true}
        >
          <div style={{"textAlign":"center"}}>
            <QRCode value={this.props.coinbase} size={256} logo={"src/assets/images/idinar.jpg"}/>
          </div>
        </CardMedia>        
      </Card>
    );
  }
}