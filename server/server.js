const http = require('http').createServer();

const io = require('socket.io')(http, {
    cors: { origin: "*" }
});

// get random uuid
users = {}

io.on('connection', socket => {
    socket.on('username', Name => {
        if (Name !== '' && Name !== undefined && Name !== null) {
            io.emit('connected', Name)
            users[socket.id] = Name

            io.emit('online', users)
        }
    })
    socket.on('message', message => {
        message !== '' ? io.emit('message', [message, socket.id, users[socket.id]]) : null
    })
    socket.on('disconnect', () => {
        io.emit('disconnected', users[socket.id])
        delete users[socket.id]
        // array of users value
        io.emit('online', users)
    })
    // socket.on('test', test => { console.log(`${test} test`) })

});

http.listen(3000, () => console.log('listening on http://localhost:3000'));