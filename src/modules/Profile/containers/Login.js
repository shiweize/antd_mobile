import React, { Component } from "react";
import { connect } from "react-redux";
import * as Path from 'constants/storePath';
import { withRouter } from "react-router-dom";
import { JSEncrypt } from "jsencrypt";
import { List, NavBar, Toast, InputItem, Button, WhiteSpace } from "antd-mobile";
import { createForm } from 'rc-form';
import { login, getPublicKey } from '../actions/profile';
import { SUCCESS } from 'constants/responseStatus';

class Login extends Component {
  constructor (props) {
    super(props);
    this.goBack = this.goBack.bind(this);
    this.onSubmitClick = this.onSubmitClick.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.encrypt = this.encrypt.bind(this);
    this.onRegisterClick = this.onRegisterClick.bind(this);
  }

  async componentDidMount () {
    await this.props.getPublicKey();
  }

  encrypt (password) {
    let encrypt = new JSEncrypt(); // 实例化加密对象
    encrypt.setPublicKey(this.props.publicKey); // 设置公钥
    return encrypt.encrypt(password);// 加密明文
  }

  goBack () {
    this.props.history.goBack();
  }

  async onSubmitClick () {
    if (!this.validateForm()) return;
    let { userName, passWord } = this.props.form.getFieldsValue();
    // 临时跳转页面，没有做请求
    if ( userName === "zhangsan" && passWord === '123456') {
      this.props.history.push('/story');
    } else if ( userName === "" || passWord === '') {
      Toast.fail("用户名或密码为空", 2);
    } else {
      Toast.fail("用户名或密码有误", 2);
    }
    // *********走编码格式************ //
    const { publicKey } = this.props;
    passWord = this.encrypt(passWord);
    await this.props.login({ userName, passWord, publicKey });

    const { error } = this.props;
    if (error.errorNum !== SUCCESS) {
      Toast.fail(error.errorMsg, 2);
      return;
    }

    const { loginResponse } = this.props;
    // todo get token and save it
    localStorage.setItem('userName', loginResponse.username);
    // // console.log(localStorage.getItem('userName'));
    this.props.history.push('/profile');
  }

  onRegisterClick () {
    this.props.history.push('/register');
  }

  validateForm () {
    let error;
    this.props.form.validateFields((err) => {
      error = err;
    });
    if (error) {
      for (let key in error) {
        Toast.fail(this.props.form.getFieldError(key), 2);
        return false;
      }
    }
    return true;
  }

  render () {
    const { getFieldProps, getFieldError } = this.props.form;
    return (
      <div>
        <NavBar mode="dark" onLeftClick={this.goBack}>登录</NavBar>
        <List style={{ height: '2rem', paddingTop: '50px', background: '#fff' }}>
          <InputItem
            {...getFieldProps('userName', {
              rules: [
                { required: true, message: '用户名不能为空' }
              ]
            })}
            clear
            error={!!getFieldError('userName')}
            placeholder="用户名、邮箱或手机号">
            <div>用户名：</div>
          </InputItem>
          <InputItem
            {...getFieldProps('passWord', {
              rules: [
                { required: true, message: '密码不能为空' }
              ]
            })}
            type="password"
            error={!!getFieldError('passWord')}
            placeholder="输入密码">
            <div>密码：</div>
          </InputItem>
          <List.Item>
            <Button 
              type="primary" 
              style={{ color: 'white', width: '3rem', margin: '0 auto' }} 
              onClick={this.onSubmitClick}>登录</Button>
            <WhiteSpace />
            <div 
              style={{ width: '100%', color: '#108ee9', textAlign: 'center' }} 
              onClick={this.onRegisterClick}>
              没有账号？马上注册一个
            </div>
          </List.Item>
        </List>
      </div>
    );
  }
}

function mapStateToProps (state) {
  const profileStorePath = ['profile', Path.PROFILE_REDUCER];
  const errorStorePath = ['common', Path.ERROR_REDUCER];
  return {
    publicKey: state.getIn([...profileStorePath, Path.PUBLIC_KEY]),
    loginResponse: state.getIn([...profileStorePath, Path.LOGIN]),
    error: state.getIn([...errorStorePath, Path.GLOBAL_ERROR])
  };
}

function mapDispatchToProps (dispatch) {
  return {
    login: (payload) => dispatch(login(payload)),
    getPublicKey: (payload) => dispatch(getPublicKey(payload))
  };
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(createForm()(Login)));

