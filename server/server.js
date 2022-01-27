const http = require('http').createServer();

const io = require('socket.io')(http, {
    cors: { origin: "*" }
});

io.on('connection', socket => {
    console.log('a user connected');
    socket.on('message', message => {
        console.log(message)
        message !== '' ? io.emit('message', [message, socket.id]) : null
    })
});

http.listen(3000, () => console.log('listening on http://localhost:3000'));