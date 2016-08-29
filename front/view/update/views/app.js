
import React, {Component} from 'react';
import {deepOrange500, green700, blue50} from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton/IconButton';
import ContentFilter from 'material-ui/svg-icons/content/filter-list';
import {Router, Route, Link, IndexLink} from 'react-router'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import CommunicationCall from 'material-ui/svg-icons/communication/call';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import HttpIcon from 'material-ui/svg-icons/action/http';
import {indigo500} from 'material-ui/styles/colors';
import CommunicationEmail from 'material-ui/svg-icons/communication/email';
import AccountBox from 'material-ui/svg-icons/action/account-box';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import AccessTime from 'material-ui/svg-icons/device/access-time';

import Home from './home';
import s from './app.style';
import {userAction} from '../../../actions';
import { connect } from 'react-redux';
import {request, str} from '../../../tools';
import Drawer from 'material-ui/Drawer';


const muiTheme = getMuiTheme({
  palette: {
    accent1Color: green700,
  },
  appBar: {
      color: green700
  }
});

class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      showMenu: false,
      valueSingle: '1',
      title: '首页',
      open: false,
    };
    this.titleList = [
        '首页',
        '应用列表',
        '添加应用',
    ]
    console.log(props);
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

  handleToggle = () => this.setState({open: !this.state.open});

  handleClose = () => this.setState({open: false});

  componentWillMount() {
      if (!this._userIsNotEmty()) {
          this._getUser();
      }
  }

  _getUser(){
    request('/home/getuser',
        {},
        (res) => {
            if (res.userInfo) {
              console.log(str.date(res.userInfo.last_login_time).format('y-m-d h:i:s'));
                this.props.set(res.userInfo);
            } else {
                //代表未登录
                location.href='/';
            }
        },
        (err) => {
            location.href = '/';
        }
    )
  }

  /**
   * 验证用户是否为空
   * @method _userIsNotEmty
   * @return {[type]}       [description]
   * @author jimmy
   */
  _userIsNotEmty(){
      let userReducer = this.props.userReducer;
      return userReducer && userReducer.userName;
  }

  /**
   * 动态显示appBar的title
   * @method handleChangeSingle
   * @param  {[type]}           event [description]
   * @param  {[type]}           value [description]
   * @return {[type]}                 [description]
   * @author jimmy
   */
  handleChangeSingle(event, value){
      this.setState({
          valueSingle: value,
          title: this.titleList[value-1],
      });
  }

  /**
   * 渲染appbar左边菜单项
   * @method _renderMenu
   * @return {[type]}    [description]
   * @author jimmy
   */
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

  /**
   * 登出操作
   * @method _logout
   * @return {[type]} [description]
   * @author jimmy
   */
  _logout(){
      request(
          '/home/login/logout/',
          {},
          (res) => {
              console.log(res);
              console.log(this.props);
              this.props.logout();
              location.href = '/';
          },
          (err) => {
              this.props.logout();
              location.href = '/';
          }
      )
  }

  render() {
      let userInfo = this.props.userReducer;
    return (
        <MuiThemeProvider muiTheme={muiTheme}>
          <div style={s.container}>
              <AppBar
                  title={this.state.title}
                  iconClassNameRight='muidocs-icon-navigation-expand-more'
                  onLeftIconButtonTouchTap={() => this._toggolMenu()}
                  iconElementLeft={this._renderMenu()}
                  iconElementRight={this._renderRightElement()}
              ></AppBar>
            {this.props.children || <Home></Home>}
            <Drawer
              docked={false}
              width={300}
              open={this.state.open}
              openSecondary={true}
              onRequestChange={(open) => this.setState({open})}
            >
                <AppBar
                    title='用户信息'
                    iconElementLeft={<IconButton  onTouchTap={this.handleToggle}><NavigationClose /></IconButton>}
                ></AppBar>
                <List>
                    <ListItem
                      leftIcon={<AccountBox color={green700} />}
                      primaryText={userInfo.user_name}
                      secondaryText='用户名'
                    />
                    <Divider inset={true} />
                    <ListItem
                      leftIcon={<CommunicationCall color={green700} />}
                      primaryText={str.formatPhone(userInfo.phone)}
                      secondaryText='联系电话'
                    />
                    <Divider inset={true} />
                    <ListItem
                      leftIcon={<CommunicationEmail color={green700} />}
                      primaryText={userInfo.email}
                      secondaryText='电子邮箱'
                    />
                    <Divider inset={true} />
                    <ListItem
                      leftIcon={<HttpIcon color={green700} />}
                      primaryText={userInfo.last_login_ip}
                      secondaryText='上次登录ip'
                    />
                    <Divider inset={true} />
                    {
                        userInfo.last_login_time?
                        <ListItem
                          leftIcon={<AccessTime color={green700} />}
                          primaryText={str.date(userInfo.last_login_time).format('y-m-d h:i:s')}
                          secondaryText='上次登录时间'
                        />: null
                    }

                </List>

                <Divider inset={true} />

                <div style={s.infoLabelBtnContainer}>
                    <RaisedButton
                        label='确定'
                        primary={true}
                        style={{
                            color: green700,
                            marginRight: 10
                        }}
                        onTouchTap={this.handleToggle}
                    ></RaisedButton>
                    <RaisedButton
                        onTouchTap={this._logout.bind(this)}
                        label='登出'
                    ></RaisedButton>
                </div>

            </Drawer>
          </div>
        </MuiThemeProvider>
    );
  }


  _renderRightElement(){
      let userInfo = this.props.userReducer;

      return (
          <div>
              <FlatButton
                 onTouchTap={this.handleToggle}
               >
                   <div style={s.userBtn}>
                       当前登录用户：{userInfo.user_name}
                   </div>
               </FlatButton>
               <FlatButton
                  onTouchTap={this._logout.bind(this)}
                >
                    <div style={s.userBtn}>
                        登出
                    </div>
                </FlatButton>
          </div>
      )
  }
}



let setState = (state) => {
    return {
        userReducer: state.userReducer
    }
};

let setAction = (dispatch) => {
    return {
        logout: () => {dispatch(userAction.logout())},
        login: (userInfo) => dispatch(userAction.login(userInfo)),
        set: (userInfo) => dispatch(userAction.set(userInfo)),
    }
}
module.exports = connect(setState, setAction)(App);

// export default Main;
