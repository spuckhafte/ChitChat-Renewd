const socket = io.connect('http://localhost:3000')


socket.on('message', msg => {
    const msgParent = document.createElement('div')
    const msg_el = document.createElement('div')

    const name = document.createElement('div')
    name.innerText = msg[2]
    name.style.fontSize = 'x-small'
    name.style.fontWeight = 'bold'
    name.style.wordBreak = 'break-all'
    name.style.color = colors['secondary']
    name.style.backgroundColor = 'transparent'

    msg_el.innerText = msg[0]
    msgParent.appendChild(msg_el)
    msgParent.appendChild(name)

    let message_area = document.getElementById('receive-message-area')

    message_area.appendChild(msgParent)
    style(socket.id, msg[1], msg_el, msgParent, name)
})


socket.on('connected', user => {
    // create new div
    const joinMsg = document.createElement('div')

    joinMsg.innerText = `${user} joined`
    // set position relative, left 50%, transform translateX(-50%)
    joinMsg.style.position = 'relative'
    // joinMsg.style.width = '50%'
    joinMsg.style.display = 'table'
    joinMsg.style['margin'] = '0 auto'

    joinMsg.style.fontSize = 'smaller'
    joinMsg.style.fontWeight = 'bold'

    joinMsg.style.color = colors['info']
    joinMsg.style.backgroundColor = 'transparent'
    // append to receive message area
    document.getElementById('receive-message-area').appendChild(joinMsg)
})

socket.on('disconnected', user => {
    // create new div
    const joinMsg = document.createElement('div')

    joinMsg.innerText = `${user} left`
    // set position relative, left 50%, transform translateX(-50%)
    joinMsg.style.position = 'relative'
    // joinMsg.style.width = '50%'
    joinMsg.style.display = 'table'
    joinMsg.style['margin'] = '0 auto'

    joinMsg.style.fontSize = 'smaller'
    joinMsg.style.fontWeight = 'bold'

    joinMsg.style.color = colors['danger']
    joinMsg.style.backgroundColor = 'transparent'
    // append to receive message area
    document.getElementById('receive-message-area').appendChild(joinMsg)
})


// get any color from colors object accept secondary
function getRandomColor() {
    const keys = Object.keys(colors)
    // color should not be secondary
    while (true) {
        const random = keys[Math.floor(Math.random() * keys.length)]
        if (random !== 'secondary' && random !== 'light' && random !== 'dark') {
            return colors[random]
        }
    }
}


socket.on('online', users => {
    // users = "id and name object"
    let online_area = document.getElementById('user-content')
    let userids = Object.keys(users)
    if (userids.length > 0) {
        online_area.innerHTML = ''

        userids.forEach(userid => {
            let user_el = document.createElement('li')

            userid == socket.id ? user_el.innerText = `${users[userid]} (you)` : user_el.innerText = users[userid]
            user_el.style.color = getRandomColor()
            user_el.style.fontSize = '2.4vh'
            user_el.style.fontWeight = 'bold'
            user_el.style.wordBreak = 'break-all'
            user_el.style.backgroundColor = 'transparent'
            online_area.appendChild(user_el)
        })
    }
})

function sendMessage() {
    let msg = document.querySelector('textarea').value
    document.querySelector('textarea').value = ''
    socket.emit('message', msg)
}

function style(socketId, userId, element, elementParent, elementName, username) {
    if (socketId == userId) {
        elementParent.style.position = 'relative'
        elementParent.style.left = '100%'
        elementParent.style.transform = 'translateX(-100%)'

        elementParent.className = ' my-1'
        element.style.backgroundColor = colors['primary']
        elementParent.style.width = '40%'
        element.style.width = '100%'
        element.style.wordBreak = 'break-all'
        element.style.fontSize = 'medium'
        element.style.padding = '3px'
        elementName.innerText = 'You'

    } else {
        elementParent.className = 'my-1'
        element.style.backgroundColor = colors['secondary']
        elementParent.style.width = '40%'
        element.style.width = '100%'
        element.style.wordBreak = 'break-all'
        element.style.fontSize = 'medium'
        element.style.padding = '3px'
    }
}


// message send event
document.getElementById('send-btn').onclick = () => {
    sendMessage()
}

window.onload = () => {
    username = login()
    if (username == '' && username == undefined && username == null) window.location.reload()
    else socket.emit('username', username); document.getElementById('send-btn').style.cursor = 'not-allowed'
}

// function that takes username from prompt
function login() {
    while (true) {
        username = prompt('Enter your username (only alphabet, max 10 characters):')
        if (username !== null && username !== undefined && /^[a-zA-Z()]+$/.test(username) && username.length <= 10) {
            return username
        } else {
            continue
        }
    }
}

// keyboard restrictions
document.getElementById('msg-input').onfocus = () => { document.getElementById('msg-input').style.border = '4px solid #5bc0de' }
// change border to none when focus is lost
document.getElementById('msg-input').onblur = () => {
    document.getElementById('msg-input').style.border = 'none'
    // add transition of 0.2s
    e('#msg-input').styl({
        'transition': '0.2s ease-in-out',
    })
}

document.getElementById('msg-input').onkeydown = () => {
    if (event.keyCode == 13 && !event.shiftKey) {
        event.preventDefault();
        sendMessage()
    }

    let special1 = [106, 107, 109, 110, 111, 186, 187, 188, 189, 190, 191, 192, 219, 220, 221, 222]
    let inp = String.fromCodePoint(event.keyCode);

    if (document.getElementById('msg-input').value.length == 0 && (/[a-zA-Z0-9-_ ]/.test(inp) || special1.includes(event.keyCode))) {
        let button = document.getElementById('send-btn')
        // change background color to green
        button.style.backgroundColor = colors['success']
        document.getElementById('send-btn').style.cursor = 'pointer'
        // apply 1s transition to button
        button.style.transition = 'background-color 0.5s'
    }
    // check if total characters are 1 and key pressed is backspace
    if (document.getElementById('msg-input').value.length == 1 && event.keyCode == 8) {
        // change color to gray
        document.getElementById('send-btn').style.backgroundColor = 'gray'
        document.getElementById('send-btn').style.cursor = 'not-allowed'
        // apply 1s transition to button
        document.getElementById('send-btn').style.transition = 'background-color 0.5s'
    }
}

document.getElementById('msg-input').onkeyup = () => {
    if (event.keyCode == 8 && document.getElementById('msg-input').value.length == 0) {
        // change color to gray
        document.getElementById('send-btn').style.backgroundColor = 'gray'
        document.getElementById('send-btn').style.cursor = 'not-allowed'
        // apply 1s transition to button
        document.getElementById('send-btn').style.transition = 'background-color 0.5s'
    }
}

// object of bootstrap colors and hexcodes
const colors = {
    'primary': '#007bff',
    'secondary': '#6c757d',
    'success': '#28a745',
    'danger': '#dc3545',
    'warning': '#ffc107',
    'info': '#17a2b8',
    'light': '#f8f9fa',
    'dark': '#343a40',
}

// make array of font families for css
const fontFamilies = [
    'Arial',
    'Courier New',
    'Georgia',
    'Helvetica',
    'Impact',
    'Lucida Console',
    'Lucida Sans Unicode',
    'Palatino Linotype',
    'Tahoma',
    'Times New Roman',
    'Trebuchet MS',
    'Verdana',
]


function e(query) {
    const self = {
        element: () => {
            if (query.charAt(0) == '#') {
                return document.getElementById(query.replace('#', ''))
            } else if (query.charAt(0) == '.') {
                return document.getElementsByClassName(query.replace('.', ''))
            } else {
                return document.querySelector(query)
            }
        },

        htm: () => self.element(),
        value: () => self.element.value,
        inhtm: (value) => {
            if (value == null) return self.element().innerHTML
            else self.element().innerHTML = value
        },
        intxt: (value) => {
            if (value == null) return self.element().innerText
            else self.element().innerText = value
        },

        evnt: (event, callback) => self.element().addEventListener(event, callback),
        attr: (attr, value) => self.element().setAttribute(attr, value),
        nuel: (type, attr) => {
            if (attr == null) {
                const new_el = self.element().appendChild(document.createElement(type))
                return e(new_el)
            }
            else {
                attr.charAt(0) == '#' ? self.element().appendChild(document.createElement(type)).setAttribute('id', attr.replace('#', ''))
                    : self.element().appendChild(document.createElement(type)).setAttribute('class', attr.replace('.', ''))
            }
        },
        styl: (styleObject) => {
            if (styleObject == null) return self.element().style
            else {
                for (let key in styleObject) {
                    self.element().style[key] = styleObject[key]
                }
            }
        }
    }

    return self
}