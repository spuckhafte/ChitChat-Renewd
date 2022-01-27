const socket = io('ws://localhost:3000')

socket.on('message', msg => {
    const msg_el = document.createElement('div')
    msg_el.innerText = msg[0]
    socket.id == msg[1] ? msg_el.id = 'self' : msg_el.id = 'other'
    document.getElementById('receive-message-area').appendChild(msg_el)
})

function sendMessage() {
    let msg = document.querySelector('textarea').value
    document.querySelector('textarea').value = ''
    socket.emit('message', msg)
}


// message send event
document.getElementById('send-btn').onclick = () => {
    sendMessage()
}

window.onload = () => {
    document.getElementById('send-btn').style.cursor = 'not-allowed'
}

// keyboard restrictions
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