const socket = io.connect('http://localhost:3000');

const STORAGE_PREFIX = 'shit-';

const lastStaticID = localStorage.getItem(STORAGE_PREFIX + 'lastStaticId');

const Page = new Spuck({ type: 'main', parent: '#register', class: 'page' }).render();

/*
    0: login
    1: register
*/

const setMode = Page.$state('mode', 0);
Page.make();

const Login = new Spuck({ type: 'div', parent: '.page', class: 'login' }).render();
const Register = new Spuck({ type: 'div', parent: '.page', class: 'register' }).render();

Page.init.pseudoChildren = [Login, Register];
Page.render('re')

Login.$effect(() => {
    Login.prop = { css: { display: Page.getState('mode') === 0 ? 'block' : 'none' } }
    Login.render('re')
}, ['$$-mode'])

Login.make('re');

Register.$effect(() => {
    Register.prop = { css: { display: Page.getState('mode') === 1 ? 'block' : 'none' } }
    Register.render('re');
}, ['$$-mode'])

Register.make('re');

const LoginForm = new Spuck({ type: 'div', parent: '.login', class: 'login-form' }).render();
LoginForm.prop = {
    css: {
        display: 'flex', flexDirection: 'column', height: '80vh',
        alignItems: 'center', justifyContent: 'center'
    }
}
LoginForm.make('re');

const LoginIdInput = new Spuck({ type: 'input', parent: '.login-form', class: 'login-id-input' }).render();
const setVal = LoginIdInput.$state('value', lastStaticID ? lastStaticID : '');
LoginIdInput.prop = { value: '$-value', css: { width: '15rem', height: '40px', fontSize: 'large', marginTop: '-5rem' } }
LoginIdInput.attr = { autofocus: 'true', placeholder: 'UserId', type: 'text' }
LoginIdInput.events = { input: e => setVal(e.target.value) }
LoginIdInput.make('re');

const LoginButton = new Spuck({ type: 'input', parent: '.login-form', class: 'register-button' }).render();
LoginButton.attr = { type: 'button', value: 'Login' }
LoginButton.prop = { css: { fontSize: 'medium', marginTop: '2rem', cursor: 'pointer' } }
LoginButton.make('re');

const ToggleRegister = new Spuck({ type: 'input', parent: '.login-form', class: 'toggle-register' }).render();
ToggleRegister.attr = { type: 'button', value: 'Not Registered?' }
ToggleRegister.prop = {
    css: { color: '#0000EE', fontSize: 'medium', marginTop: '1rem', cursor: 'pointer', backgroundColor: 'transparent' }
}
ToggleRegister.events = { click: () => setMode(1) }
ToggleRegister.make('re');

LoginIdInput.events = {
    keydown: e => {
        if (e.keyCode !== 13) return;
        login();
    }
}
LoginIdInput.render('re');

LoginButton.events = { click: () => login() }
LoginButton.render('re');


const RegisterForm = new Spuck({ type: 'div', parent: '.register', class: 'register-form' }).render();
RegisterForm.prop = {
    css: {
        display: 'flex', flexDirection: 'column', height: '80vh',
        alignItems: 'center', justifyContent: 'center'
    }
}
RegisterForm.make('re');


const RegisterNameInput = new Spuck({ type: 'input', parent: '.register-form', class: 'register-name-input' }).render();
const setName = RegisterNameInput.$state('value', '');
RegisterNameInput.prop = { value: '$-value', css: { width: '15rem', height: '40px', fontSize: 'large', marginTop: '-5rem' } }
RegisterNameInput.attr = { autofocus: 'true', placeholder: 'UserName', type: 'text' }
RegisterNameInput.events = { input: e => setName(e.target.value) }
RegisterNameInput.make('re');

const RegisterIdInput = new Spuck({ type: 'input', parent: '.register-form', class: 'register-id-input' }).render();
const setId = RegisterIdInput.$state('value', `${generateUID()}`);
RegisterIdInput.prop = { value: '$-value', css: { width: '15rem', height: '40px', fontSize: 'large', marginTop: '1rem' } }
RegisterIdInput.attr = { placeholder: 'UserId', type: 'text', disabled: 'true' }
RegisterIdInput.make('re');

const RegisterButton = new Spuck({ type: 'input', parent: '.register-form', class: 'register-button' }).render();
RegisterButton.attr = { type: 'button', value: 'Register' }
RegisterButton.prop = {
    css: { fontSize: 'medium', marginTop: '2rem', cursor: 'pointer' }
}
RegisterButton.make('re');

const ToggleLogin = new Spuck({ type: 'input', parent: '.register-form', class: 'toggle-login' }).render();
ToggleLogin.attr = { type: 'button', value: 'Already Registered?' }
ToggleLogin.prop = {
    css: { color: '#0000EE', fontSize: 'medium', marginTop: '1rem', cursor: 'pointer', backgroundColor: 'transparent' }
}
ToggleLogin.events = { click: () => setMode(0) }
ToggleLogin.make('re');

RegisterButton.events = {
    click: () => {
        const name = RegisterNameInput.getState('value');
        const id = RegisterIdInput.getState('value');
        if (!validString(name)) {
            alert('Invalid username');
            return;
        } else { 
            setName('');
            socket.emit('register', { id, name });
        }
    }
}
RegisterButton.render('re');


socket.on('registered', (name, id) => {
    if (!id) return;
    window.location.href = './home.html';
    sessionStorage.setItem(`${STORAGE_PREFIX}userStaticId`, id);
    sessionStorage.setItem(`${STORAGE_PREFIX}userName`, name);
    localStorage.setItem(`${STORAGE_PREFIX}lastStaticId`, id);
    localStorage.setItem(`${STORAGE_PREFIX}userName`, name);
})

socket.on('login-error', query => alert(query));

socket.on('logged', (name, id) => {
    window.location.href = './home.html';
    sessionStorage.setItem(`${STORAGE_PREFIX}userStaticId`, id);
    sessionStorage.setItem(`${STORAGE_PREFIX}userName`, name);
    localStorage.setItem(`${STORAGE_PREFIX}lastStaticId`, id);
    localStorage.setItem(`${STORAGE_PREFIX}userName`, name);
})

function login() {
    const id = LoginIdInput.getState('value');
    if (!validString(id)) {
        alert('Invalid UserId');
        return;
    } else {
        socket.emit('login', id);
    }
}

function validString(id) {
    let valid = false;
    for (char of id.split('')) {
        if (char !== ' ') {
            valid = true;
            return valid;
        }
    }
    return valid;
}

function generateUID() {
    // I generate the UID from two parts here 
    // to ensure the random number provide enough bits.
    var firstPart = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);
    return firstPart + secondPart;
}