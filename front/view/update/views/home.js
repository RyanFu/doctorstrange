import React, {Component} from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import {Page} from 'components';
import {titleAction} from 'actions';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import Snackbar from 'material-ui/Snackbar';
import s from './home.style';
import {TextField} from 'components';
import {deepOrange500, green700, blue500, orange500} from 'material-ui/styles/colors';
import FileUpload from 'react-fileupload';
import LinearProgress from 'material-ui/LinearProgress';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {request, str} from 'tools';



class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            showDialog: false,
            appName: '',
            appBundleId: undefined,
            description: '',
            platform: undefined,
            errmsg:'',
        };


        this.options = {
          baseUrl:'/update/app/addapp',
          param:{
              appName: this.state.appName,
              appBundleId: this.state.appBundleId,
              description: this.state.description,
              platform: this.state.platform
          },
          chooseAndUpload: false,
          dataType: 'json',
          multiple: false,
          fileFieldName: 'icon',
          chooseFile: (files) => this._chooseFiles(files),
          uploading: (progress, mill) => this._showProgress(progress),
          doUpload: (files,mill,xhrID) => {

          },
          accept:'image/*',
          uploadSuccess: this._uploadSuccess,
          uploadError: this._uploadError,
          uploadFail: this._uploadError,
          beforeUpload: this._beforeUpload,
        }
    }

    _uploadError = (err) => {
        if (err.errno != 0) {
            this.setState({
                errmsg: err.data.errmsg,
                completed: 0,
                pageLoading: false,
            });
        }
    }

    _beforeUpload = () => {
        if (this.state.exist == true) {
            return false;
        } else if (!this.state.appName || !this.state.appBundleId || !this.state.platform) {
            return false
        } else {
            return true;
        }
    }

    _uploadSuccess = (res) => {
        if (res.errno == 0) {
            this.setState({
                errmsg: res.data.errmsg,
                showDialog: false,
                appName: '',
                appBundleId: undefined,
                description: '',
                platform: undefined,
                completed: 0,
                fileName: ''
            });

            this.options.param = {
                appName: '',
                appBundleId: undefined,
                description: '',
                platform: undefined
            }
        }
    }

    /**
     * 显示进度条
     * @method _showProgress
     * @param  {[type]}      progress [description]
     * @return {[type]}               [description]
     * @author jimmy
     */
    _showProgress = (progress) => {
        let completed = (progress.loaded/progress.total) * 100;

        if (completed >= 100) {
            this.setState({
                completed: 100,
            })
        } else {
            this.setState({
                completed: completed,
            })
        }

    }

    _chooseFiles = (files) => {
        let file = files[0];
        let name = file.name;
        this.setState({
            fileName: name,
            imgSrc: file,
        })
    }

    componentDidMount() {
        this.props.setTitle('首页');
    }

    render(){

        let actions = [
            <FlatButton
                label='取消'
                secondary={true}
                keyboardFocused={false}
                onTouchTap={() => {
                    this.setState({
                        showDialog: false
                    });
                }}
            ></FlatButton>,
        ];

        return (
            <Page>
                <div>
                    <Card>
                       <CardHeader
                         actAsExpander={true}
                         showExpandableButton={true}
                       />
                        <img src='http://www.songxiaocai.com/images/logo.png' alt=""/>
                       <CardText>
                           <RaisedButton
                               primary={true}
                               label='添加app'
                               keyboardFocused={true}
                               onTouchTap={this._addAppDialog}
                           ></RaisedButton>
                       </CardText>
                     </Card>
                     <Dialog
                         title='添加应用'
                         actions={actions}
                         modal={false}
                         open={this.state.showDialog}
                         onRequestClose={this._handleClose}
                     >
                         {this._renderAddContent()}
                     </Dialog>
                </div>
            </Page>
        )
    }

    _renderAddContent = () => {
        return (
            <div style={s.addContainer}>
                <div>
                    <TextField
                       floatingLabelText='app名字'
                       hintText='请填写app名字'
                       floatingLabelStyle={s.floatingLabelStyle}
                       floatingLabelFocusStyle={s.floatingLabelFocusStyle}
                       errorStyle={s.errorStyle}
                       type='text'
                       defaultValue={this.state.appName}
                       onChange={(res)=>this._onTextChange('appName', res)}
                     />
                </div>
                <div>
                    <TextField
                       floatingLabelText='bundleID(或安卓的ApplicationID)'
                       hintText='请填写BundleID'
                       floatingLabelStyle={s.floatingLabelStyle}
                       floatingLabelFocusStyle={s.floatingLabelFocusStyle}
                       errorStyle={s.errorStyle}
                       type='text'
                       defaultValue={this.state.appBundleId}
                       onChange={(res)=>this._onTextChange('appBundleId', res)}
                     />
                </div>
                <div>
                    <TextField
                       floatingLabelText='app描述'
                       hintText='请填写app描述'
                       multiLine={true}
                       rows={2}
                       defaultValue={this.state.description}
                       onChange={(res)=>this._onTextChange('description', res)}
                     />
                </div>
                <div>
                    <SelectField
                        value={this.state.platform}
                        onChange={this._handlePlatformSelect}
                        floatingLabelText='应用平台'
                        hintText='请选择'
                        floatingLabelStyle={s.floatingLabelStyle}
                        floatingLabelFocusStyle={s.floatingLabelFocusStyle}
                        errorStyle={s.errorStyle}
                        autoWidth={true}
                        style={s.selectStyle}
                        value={this.state.platform}
                    >
                        <MenuItem value={1} label="IOS" primaryText="IOS" />
                        <MenuItem value={2} label="Android" primaryText="Android" />
                    </SelectField>
                </div>

                <h5 style={s.errmsg}>
                    上述信息皆为必填信息
                </h5>
                <TextField
                    disabled={true}
                    value={this.state.fileName}
                    hintText='请选择！'
                ></TextField>
                <FileUpload options={this.options} >
                    <RaisedButton
                        ref='chooseBtn'
                        primary={true}
                        disableTouchRipple={true}
                        disableFocusRipple={true}
                        style={{margin: 12, marginRight: 6}}
                        label='选择文件'
                        ></RaisedButton>
                    <RaisedButton
                        ref='uploadBtn'
                        primary={true}
                        disableTouchRipple={true}
                        disableFocusRipple={true}
                        style={{margin: 12, marginRight: 6}}
                        label='完成'
                        ></RaisedButton>
                </FileUpload>
                <LinearProgress
                    mode='determinate'
                    value={this.state.completed}
                    max={this.state.max}
                    min={0}
                    ></LinearProgress>
                <h4 style={s.errmsg}>{this.state.errmsg}</h4>
            </div>
        )
    }

    _handlePlatformSelect = (event, index, value) => {
        this.options.param.platform = value;
        this.setState({
            platform: value
        });
    }


    componentDidUpdate(prevProps, prevState) {
        if ((this.state.platform != prevState.platform ||
            this.state.appBundleId != prevState.appBundleId)
            && this.state.platform !== undefined
            && this.state.appBundleId !== undefined) {
            request(
                '/update/app/appexist',
                {
                    appBundleId: this.state.appBundleId,
                    platform: this.state.platform,
                },
                (res) => {
                    console.log(res);
                    if (res.exist) {
                        this.setState({
                            exist: res.exist,
                            errmsg: '该应用已存在！'
                        });
                    } else {
                        this.setState({
                            exist: res.exist,
                        });
                    }

                },
                (err) => {
                    this.setState({
                        pageLoading: false,
                        errmsg: err.errorMsg? err.errorMsg : '访问出错了，请重试！',
                    });
                }
            )
        }
    }
    /**
     * 版本号变更
     * @method _onTextChange
     * @param  {[type]}      type [description]
     * @param  {[type]}      res  [description]
     * @return {[type]}           [description]
     * @author jimmy
     */
    _onTextChange(type, res){
        switch (type) {
              case 'appName':
                  this.options.param.appName = res;
                  this.setState({
                      appName: res
                  });
                break;
              case 'appBundleId':
                  this.options.param.appBundleId = res;
                  this.setState({
                      appBundleId: res
                  });
                  break;
              case 'description':
                  this.options.param.description = res;
                  this.setState({
                      description: res
                  });
                  break;
        }
    }



    _handleClose = () => {
        this.setState({
            showDialog: false,
        });
    }


    _addAppDialog = () => {
        this.setState({
            showDialog: true,
        });
    }
};



let setState = (state) => {
    return {
        titleReducer: state.titleReducer,
    }
};

let setAction = (dispatch) => {
    return {
        setTitle: (title) => dispatch(titleAction.setTitle(title))
    }
}
module.exports = connect(setState, setAction)(Home);
