import React from 'react'
import Logo from '../../component/logo/logo'
import { List, InputItem, WingBlank, WhiteSpace, Button } from 'antd-mobile'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { login } from '../../redux/user.redux'
import imoocFrom from '../../component/imooc-form/imooc-form'

// 函数式编程
// function hello(){
//   console.log('hello imooc')
// }

// function WrapperHello(fn){
//   return function(){
//     console.log('before say hello')
//     fn()
//     console.log('after say hello')
//   }
// }

// hello = WrapperHello(hello)
// hello()

// 属性代理
// function WrapperHello(Comp){
//   class WrapComp extends React.Component{
//     render() {
//       return (
//         <div>
//           <p>这是HOC高阶组件特有的元素</p>
//           <Comp {...this.props}></Comp>
//         </div> 
//       )
//     }
//   }
//   return WrapComp
// }

// @WrapperHello
// class Hello extends React.Component{
//   render() {
//     return <h2>hello imooc</h2>
//   }
// }


// Hello = WrapperHello(Hello)

// 反向代理
// function WrapperHello(Comp){
//   class WrapComp extends Comp{
//     componentDidMount() {
//       console.log('高阶组件新增的生命周期，加载完成')
//     }
//     render() {
//       return <Comp></Comp>
//     }
//   }
//   return WrapComp
// }

// @WrapperHello
// class Hello extends React.Component{
//   render() {
//     return <h2>hello imooc</h2>
//   }
// }

@connect(
  state => state.user,
  { login }
)
@imoocFrom
class Login extends React.Component {
  constructor(props) {
    super(props)
    // 使用了高阶组件之后
    // this.state = {
    //   user: '',
    //   pwd: ''
    // }
    this.register = this.register.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
  }
  register() {
    this.props.history.push('/register')
  }
  // handleChange(key, val) {
  //   this.setState({
  //     [key]: val
  //   })
  // }
  handleLogin() {
    this.props.login(this.props.state)
  }
  render() {
    return (
      <div>
        {/* <Hello></Hello> */}
        {this.props.redirectTo&&this.props.redirectTo!=='/login' ? <Redirect to={this.props.redirectTo} /> : null}
        <Logo></Logo>
        <WingBlank>
          <List>
            {this.props.msg ? <p className='error-msg'>{this.props.msg}</p> : null}
            <InputItem
              onChange={v => this.props.handleChange('user', v)}
            >用户</InputItem>
            <WhiteSpace />
            <InputItem
              type='password'
              onChange={v => this.props.handleChange('pwd', v)}
            >密码</InputItem>
          </List>
          <WhiteSpace />
          <Button type='primary' onClick={this.handleLogin}>登录</Button>
          <WhiteSpace />
          <Button onClick={this.register} type='primary'>注册</Button>
        </WingBlank>
      </div>
    )
  }
}

export default Login