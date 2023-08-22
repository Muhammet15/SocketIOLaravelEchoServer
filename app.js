const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const axios = require('axios');

const config = {
    url: {
        base: 'http://127.0.0.1:8000',
        api: 'api',
        profile: 'get/user/info'
    }
};

const conversation = {
    url: {
        base: 'http://127.0.0.1:8000',
        api: 'api',
        profile: 'post/conversation/room/7'
    }
};

const messages = {
    url: {
        base: 'http://127.0.0.1:8000',
        api: 'api',
        profile: '/update-user-status'
    }
};

// Kullanıcının adını almak için API'ye GET isteği gönderen fonksiyon
const getUserInfo = async (token) => {
    try {
        const response = await axios.get(`${config.url.base}/${config.url.api}/${config.url.profile}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error) {
        console.error(error);
    }
};

const joinRoom = async (token, to_user_id) => {
    try {
        const response = await axios.post(`${conversation.url.base}/${conversation.url.api}/${conversation.url.profile}`, {
            to_user_id: to_user_id
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error) {
        console.error(error);
    }
};

const postMessage = async (token, messageData) => {
    try {
        return await axios.post(`${messages.url.base}/${messages.url.api}/${messages.url.profile}`, messageData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    } catch (error) {
        console.error(error);
    }
};

io.on('connection', async (socket) => {
    console.log('a user is trying to connect');

    const token = socket.handshake.headers.token;
    try {
        const userName = await getUserInfo(token);
        console.log(`User connected: ${userName.user_name}`);
        socket.emit('user connected', { name: userName });

        // Kullanıcının odaya katılması
        const room_id = await joinRoom(token);
        socket.join(`${room_id}`);
        console.log(`User joined room: ${room_id}`);

        // Mesaj dinleyicisi ekleme
        socket.on('message', async (data) => {
            try {
                const senderName = await getUserInfo(token);
                const message = data.message;
                const formattedMessage = `${senderName}: ${message}`;
                io.to(`${room_id}`).emit('message', formattedMessage);
                console.log(`Message sent from ${senderName.user_name} in room ${room_id}: ${data}`);


                const messageData = {
                    conversation_id: room_id,
                    sender_id: senderName.user_id,
                    message: data
                }

                const response = await postMessage(token, messageData);
                console.log('Response from API:', response.data);
            } catch (error) {
                console.error(error);
            }
        });
    } catch (error) {
        console.error(error);
    }

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});


http.listen(3000, () => {
    console.log('Server listening on port:3000');
});
