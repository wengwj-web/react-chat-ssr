import React from 'react'
import { connect } from 'react-redux'
import { NavBar } from 'antd-mobile'
import { Route, Redirect } from 'react-router-dom'
import NavLinkBar from '../navlink/navlink'
import Boss from '../boss/boss'
import Genius from '../../component/genius/genius'
import User from '../../component/user/user'
import { getMsgList, recvMsg } from '../../redux/chat.redux'
import Msg from '../../component/msg/msg'
import QueueAnim from 'rc-queue-anim'


@connect(
  state => state,
  { getMsgList, recvMsg }
)
class Dashboard extends React.Component {
  componentDidMount() {
    if (!this.props.chat.chatmsg.length) {
      this.props.getMsgList()
      this.props.recvMsg()
    }
  }
  render() {
    const { pathname } = this.props.location
    const user = this.props.user
    const navList = [
      {
        path: '/boss',
        text: '牛人',
        icon: 'boss',
        title: '牛人列表',
        component: Boss,
        hide: user.type === 'genius'
      },
      {
        path: '/genius',
        text: 'boss',
        icon: 'job',
        title: 'BOSS列表',
        component: Genius,
        hide: user.type === 'boss'
      },
      {
        path: '/msg',
        text: '消息',
        icon: 'msg',
        title: '消息列表',
        component: Msg,
      },
      {
        path: '/me',
        text: '我',
        icon: 'user',
        title: '个人中心',
        component: User,
      }
    ]
    const page = navList.find(v => v.path == pathname)
    // 让动画生效，只渲染一个route,根据当前的path指定route
    return page ? (
      <div>
        <NavBar className='fixed-header' mode='dard'>{page.title}</NavBar>
        <div style={{ marginTop: 45 }}>
          <QueueAnim type='scaleX' duration={800}>
            <Route key={page.path} path={page.path} component={page.component}></Route>
            {/* <Switch>
              {navList.map(v => (
                <Route key={v.path} path={v.path} component={v.component}></Route>
              ))}
            </Switch> */}
          </QueueAnim>
        </div>
        <NavLinkBar data={navList}></NavLinkBar>
      </div>
    ) : <Redirect to='/msg'></Redirect>
  }
}

export default Dashboard