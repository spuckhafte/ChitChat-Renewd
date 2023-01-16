const http = require('http').createServer();
const jdb = require('json-db-jdb/fastr/jdb.js');
require('dotenv').config();

const config = process.env.shitchatconfig;

const io = require('socket.io')(http, {
    cors: { origin: "*" }
});

jdb.Machine.config = config

const port = process.env.PORT || 3000;

let users = {}
let staticIds = {}

io.on('connection', async socket => {
    console.log('connected '+socket.id);

    socket.on('username', async (Name, StaticId) => {
        socket.emit('show-static-id', StaticId)
        users[socket.id] = Name
        staticIds[socket.id] = StaticId

        const History = await getLastHistory();
        Object.keys(History).forEach(key => {
            let query = History[key].staticId == StaticId ? 'me' : 'other';
            socket.emit('message', [History[key].msg, 0, History[key].name], query)
        })

        io.emit('connected', Name)
        io.emit('online', users)
    })

    socket.on('message', message => {
        jdb.assignR('messages', {
            name: users[socket.id],
            msg: message,
            staticId: staticIds[socket.id]
        });
        message !== '' ? io.emit('message', [message, socket.id, users[socket.id]]) : null
    })

    socket.on('register', async userdata => {
        await register(userdata.name, userdata.id, socket);
        socket.emit('registered', userdata);
    })

    socket.on('login', staticId => {
        const user = jdb.getR('data', 'moral', ['userid', staticId]);
        if (!user || Object.values(staticIds).includes(staticId)) {
            if (!user) socket.emit('login-error', 'User not found');
            else socket.emit('login-error', 'Session is already active');
        } else socket.emit('logged', user.username, staticId);
    });

    socket.on('disconnect', () => {
        if (!users[socket.id]) return;
        io.emit('disconnected', users[socket.id])
        delete users[socket.id]
        delete staticIds[socket.id]
        // array of users value
        io.emit('online', users)
    })
    // socket.on('test', test => { console.log(`${test} test`) })

});

http.listen(port, () => console.log(`listening on http://localhost:${port}`));


async function getLastHistory() {
    const last_entry = Object.keys(jdb.getEl('messages', 'name')).pop();
    const history = {};
    if (last_entry == 0) return history;
    for (let i = last_entry; i >= 1; i--) {
        const entryData = jdb.getR('messages', 'entry', i);
        history[i] = entryData;
        if (i == 1) {
            return history;
        }
    }
}

async function register(username, staticId, socket) {
    jdb.assignR('data', {
        userid: staticId,
        username: username
    });
    socket.emit('registered', username, staticId);
}
