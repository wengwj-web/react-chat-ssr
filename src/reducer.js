
// 合并所有reducer并且返回
import { combineReducers } from 'redux'
import { user } from './redux/user.redux'
import { charuser } from './redux/chatuser.redux'
import { chat } from './redux/chat.redux'
export default combineReducers({ user, charuser, chat })