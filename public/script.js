const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
const socket = io('/');
myVideo.muted = true;

var myPeer = new Peer(undefined, {
  path: '/peerjs',
  host :'/',
  port: '8000'
});

let myVideoStream;
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream =>{
  myVideoStream = stream;
  addVideoStream(myVideo, stream);

  myPeer.on('call',call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream =>{
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected',(userID)=>{
    connectToNewUser(userID, stream);
  })
})

myPeer.on('open',id=>{
  socket.emit('joinRoom',Room_ID , id);

})

const connectToNewUser = (userID, stream) =>{
  console.log('new user connected with user ID as' + userID);
  const call = myPeer.call(userID, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream=>{
    addVideoStream(video, userVideoStream)
  })

}


const addVideoStream = (video, stream)=>{
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', ()=>{
    video.play();
  })

  videoGrid.append(video)
}
