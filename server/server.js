// 服务器渲染需要使用jsx语法
import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import model from './model'
import path from 'path'

import csshook from 'css-modules-require-hook/preset'
import assethook from 'asset-require-hook'

import React from 'react'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import reducers from '../src/reducer'
import { StaticRouter } from 'react-router-dom'
import App from '../src/app'
import { renderToString, renderToNodeStream } from 'react-dom/server'
import staticPath from '../build/asset-manifest.json'
// console.log(staticPath)

assethook({
  extensions: ['png']
})

// https://github.com/css-modules/css-modules-require-hook

// react组件=>div
// <div data-reactroot=""><p>server render</p><p>imooc roks</p></div>

// const express = require('express')
// const bodyParser = require('body-parser')
// const cookieParser = require('cookie-parser')
// const model = require('./model')
// const path = require('path')


const Chat = model.getModel('chat')
const app = express()
// work with express
const server = require('http').Server(app)
const io = require('socket.io')(server)

// function App() {
//   return (
//     <div>
//       <p>server render</p>
//       <p>imooc roks</p>
//     </div>
//   )
// }

// console.log(renderToString(<App></App>))


io.on('connection', function (socket) {
  socket.on('sendmsg', function (data) {
    // console.log(data)
    // 广播到全局
    // io.emit('recvmsg', data)
    const { from, to, msg } = data
    const chatid = [from, to].sort().join('_')
    Chat.create({ chatid, from, to, content: msg }, function (err, doc) {
      io.emit('recvmsg', Object.assign({}, doc._doc))
    })
  })
})

const userRouter = require('./user')

app.use(cookieParser())
app.use(bodyParser.json())
app.use('/user', userRouter)
// 编译上线
app.use(function (req, res, next) {
  if (req.url.startsWith('/user/') || req.url.startsWith('/static/')) {
    return next()
  }
  const store = createStore(reducers, compose(
    applyMiddleware(thunk)
  ))
  let context = {}

  // const markup = renderToString(<Provider store={store}>
  //   <StaticRouter
  //     location={req.url}
  //     context={context}
  //   >
  //     <App></App>
  //   </StaticRouter>
  // </Provider>)
  const obj = {
    '/msg': '聊天消息列表',
    '/boss': '查看牛人列表'
  }
  res.write(`<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <meta name="theme-color" content="#000000">
      <meta name="keywords" content="react,redux,imooc,ssr" >
      <meta name="description" content="${obj[req.url]}" >
      <meta name="author" content="wwj" >
      <title>React App</title>
      <link rel="stylesheet" href="/${staticPath['main.css']}">
    </head>
    <body>
      <noscript>
        You need to enable JavaScript to run this app.
      </noscript>
      <div id="root">`)
  const markupStream = renderToNodeStream(<Provider store={store}>
    <StaticRouter
      location={req.url}
      context={context}
    >
      <App></App>
    </StaticRouter>
  </Provider>)

  markupStream.pipe(res, { end: false })
  markupStream.on('end', () => {
    res.write(`</div>
      <script src="/${staticPath['main.js']}"></script>  
    </body>
  </html>`)
    res.end()
  })

  // const pageHtml = `
  // <!DOCTYPE html>
  // <html lang="en">
  //   <head>
  //     <meta charset="utf-8">
  //     <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  //     <meta name="theme-color" content="#000000">
  //     <meta name="keywords" content="react,redux,imooc,ssr" >
  //     <meta name="description" content="${obj[req.url]}" >
  //     <meta name="author" content="wwj" >
  //     <title>React App</title>
  //     <link rel="stylesheet" href="/${staticPath['main.css']}">
  //   </head>
  //   <body>
  //     <noscript>
  //       You need to enable JavaScript to run this app.
  //     </noscript>
  //     <div id="root">${markup}</div>
  //     <script src="/${staticPath['main.js']}"></script>  
  //   </body>
  // </html>
  // `

  // res.send(pageHtml)
  // console.log(path.resolve('build/index.html'))
  // return res.sendFile(path.resolve('build/index.html'))
})
app.use('/', express.static(path.resolve('build')))

server.listen(9093, function () {
  console.log('node app start port 9093')
}) 