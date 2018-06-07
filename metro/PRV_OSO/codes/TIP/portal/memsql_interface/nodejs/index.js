const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const memsqlc = require('./memsqlc');
const net = require('net');
const events = require('events');
const emitter = new events.EventEmitter();


app.get('/', function(req, res){
    res.sendfile('index.html');
});


io.on('connection',function(socket){
    console.log('a user connected');
    socket.on('chat message', function(msg){
        const ip = '192.168.1.189';
        const port = 23450;
        memsqlc.th_fun(ip,port,msg,io);
    });
});

app.set('port', process.env.PORT || 13030);

let server = http.listen(app.get('port'), function() {
    console.log('start at port:' + server.address().port);
});

