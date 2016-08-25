
import React, {Component} from 'react';
import {deepOrange500, green700} from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton/IconButton';
import ContentFilter from 'material-ui/svg-icons/content/filter-list';
import {Router, Route, Link, IndexLink} from 'react-router'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Home from './home';
import s from './app.style';

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  },
  appBar: {
      color: green700
  }
});

module.exports = class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      showMenu: false,
      valueSingle: '1',
      title: '首页'
    };
    this.titleList = [
        '首页',
        '应用列表',
        '添加应用',
    ]
  }

  handleRequestClose() {
    this.setState({
      open: false,
    });
  }

  handleTouchTap() {
    this.setState({
      open: true,
    });
  }

  _toggolMenu(){
      this.setState({
          showMenu: !this.state.showMenu,
      });
  }

  handleChangeSingle(event, value){
      this.setState({
          valueSingle: value,
          title: this.titleList[value-1],
      });
  }

  _renderMenu(){
      return (
          <IconMenu
             iconButtonElement={
                 <IconButton>
                 <ContentFilter
                     color='#FFFFFF'
                 />
                 </IconButton>
             }
             onChange={(event, value) => this.handleChangeSingle(event, value)}
             value={this.state.valueSingle}
             multiple={false}
             targetOrigin={{
                 vertical: 'bottom',
                 horizontal: 'right',
             }}
           >
             <MenuItem value='1'>
                 <IndexLink to='/' style={s.link} activeStyle={s.activeLink}>首页</IndexLink>
             </MenuItem>
             <MenuItem value='2'>
                 <Link to='appList' style={s.link} activeStyle={s.activeLink} >应用列表</Link>
             </MenuItem>
             <MenuItem value='3' >
                 <Link to='addApp' style={s.link} activeStyle={s.activeLink} >添加应用</Link>
             </MenuItem>
           </IconMenu>
      )

  }

  render() {
    return (
        <MuiThemeProvider muiTheme={muiTheme}>
          <div style={s.container}>
              <AppBar
                  title={this.state.title}
                  iconClassNameRight='muidocs-icon-navigation-expand-more'
                  onLeftIconButtonTouchTap={() => this._toggolMenu()}
                  iconElementLeft={this._renderMenu()}
              ></AppBar>
            {this.props.children || <Home></Home>}
          </div>
        </MuiThemeProvider>
    );
  }
}

// export default Main;
