const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidv4 } = require('uuid');
const {ExpressPeerServer} = require('peer');
const peerServer = ExpressPeerServer(server,{
  debug: true
});


app.set('view engine' , 'ejs');//embeded java script , its like index.html
app.use(express.static('public'))//specifying folder name public to use script
app.use('/peerjs',peerServer)
// peer uses webRTC which is an opensource project providing web browsers and mobile
// applications with real time communication via simple application programming interfaces
app.get('/',(req, res)=>{
  res.redirect(`/${uuidv4()}`);//uuid generated a unique id for every user
})

app.get('/:room',(req, res)=>{
  res.render('room',{roomID: req.params.room})
})

io.on('connection',socket =>{
  socket.on('joinRoom',(roomID, userID)=>{
      socket.join(roomID);
      socket.broadcast.to(roomID).emit('user-connected', userID);
  })
})
server.listen(8000);
