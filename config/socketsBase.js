const sockets = require('./initializers/sockets')
const _ = require('lodash')


module.exports = function (io) {

  io.on('connection', function (socket) {
    //socket.broadcast.emit('user connected');
    //socket.broadcast.to(socket.id).emit('id_user', {socket:socket.id});
    console.log("Session: " + socket.id);

    socket.on('message', function (from, msg) {
      console.log("msg")
      return;
    });

    socket.on('myConnection', function (data) {

      if(!sockets[data.from]) sockets[data.from] = [];
      sockets[data.from].push(socket.id);
      return;
    });

    socket.on('myConnection2', function (from, msg) {
      if(sockets[from.id]) {
        var i = 0;
          if(_.indexOf(sockets[from.id],socket.id)!==-1) {
            i ++;
          }
        if(i===0) {
            sockets[from.id].push(socket.id);
        }
      }else {
          if(!sockets[from.id]) sockets[from.id] = [];
          sockets[from.id].push(socket.id);
      }
      return;
     
    });

    socket.on('myDisConnection2', function (from, msg) {
       console.log(sockets);
      if(sockets[from.id]) {
          if(_.indexOf(sockets[from.id],socket.id)!==-1) {
            sockets[from.id].splice(_.indexOf(sockets[from.id],socket.id),1);
          }
      }
      return;
     
    });

    socket.on('disconnect', function () {
      _.forEach(sockets, function(n, key) {
          if(_.indexOf(n,socket.id)!==-1) {
            n.splice(_.indexOf(n,socket.id),1);
          }
      });
    });

 /*   socket.on('message', function (from, msg) {

      console.log('recieved message from', from, 'msg', JSON.stringify(msg));

      console.log('broadcasting message');
      console.log('payload is', msg);
      io.sockets.emit('broadcast', {
        payload: msg,
        source: from
      });
      console.log('broadcast complete');
    });*/
  });

      
};