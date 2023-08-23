import Echo from 'laravel-echo';
import { io } from 'socket.io-client';

window.io = io;

window.Echo = new Echo({
    broadcaster: 'socket.io',
    host: window.location.hostname + ':6001', // Laravel Echo Server'ın adresi
    enabledTransports: ['ws', 'wss'], // WebSocket ve Secure WebSocket
    // auth: {
    //     headers: {
    //         Authorization: 'Bearer ' + '2|ivK5hwYTTU6daOWmR9OReKh8DNSimqIa1R0SsMwC' // Erişim belirteci (token) ekleyin
    //     }
    // }
});
console.log(window.Echo);
window.Echo.channel('online_users').listen('UserStatusUpdated', (event) => {
    console.log("Received UserStatusUpdated event:", 32434);
    const onlineUsersList = document.getElementById('online-users');
    const listItem = document.createElement('li');
    listItem.textContent = event.isOnline ? 'User is online' : 'User is offline';
    onlineUsersList.appendChild(listItem);
});
