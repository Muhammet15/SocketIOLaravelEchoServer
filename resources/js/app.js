import { createApp } from 'vue';
import { io } from 'socket.io-client';

const app = createApp({});
app.mount('#app');

const socket = io('http://localhost:6001'); // WebSockets sunucusunun adresine göre ayarlayın

socket.on('connect', () => {
    console.log('Connected to WebSockets server');
});

socket.on('UserStatusUpdated', (event) => {
    console.log('User status updated event received:', event);
    const onlineUsersList = document.getElementById('online-users');
    onlineUsersList.innerHTML = '';

    event.onlineUsers.forEach((userId) => {
        const listItem = document.createElement('li');
        listItem.textContent = `User ${userId} is online`;
        onlineUsersList.appendChild(listItem);
    });
});
