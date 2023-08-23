import loadash from 'lodash'
window._ = loadash


import * as Popper from '@popperjs/core'
window.Popper = Popper

import 'bootstrap'


/**
 * Install Bootstrap 5 in Laravel 10 With Vite
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

import axios from 'axios'
window.axios = axios

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

// import Echo from 'laravel-echo';

// window.Pusher = require('pusher-js');

// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: process.env.MIX_PUSHER_APP_KEY,
//     cluster: process.env.MIX_PUSHER_APP_CLUSTER,
//     forceTLS: true
// });



// import Echo from 'laravel-echo';
// import { io } from 'socket.io-client';

// window.io = io;

// window.Echo = new Echo({
//     broadcaster: 'socket.io',
//     host: window.location.hostname + ':6001', // Laravel Echo Server'ın adresi
// });

import Echo from 'laravel-echo';
import { io } from 'socket.io-client';
console.log("SDASDAASDA");
window.io = io;

window.Echo = new Echo({
    broadcaster: 'socket.io',
    host: window.location.hostname + ':6001', // Laravel Echo Server'ın adresi
    enabledTransport: ['ws'],
    transport:['websocket']
});

window.Echo.channel(`online_users`)
.listen('UserStatusUpdated', (event) => {
    const onlineUsersList = document.getElementById('online-users');
    const listItem = document.createElement('li');
    listItem.textContent = event.isOnline ? 'User is online' : 'User is offline';
    onlineUsersList.appendChild(listItem);
});
