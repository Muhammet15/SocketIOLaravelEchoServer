<!DOCTYPE html>
<html>
<head>
    <title>Online Users</title>
</head>
<body>
    <h1>Online Users</h1>
    <ul id="online-users"></ul>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.2.0/socket.io.js"></script>
    <script>
        const socket = io('http://localhost:6001'); // Laravel Echo Server'ın adresi

        socket.on('connect', () => {
            console.log('Connected to Socket.io server');
        });
        console.log(this.echo);
        socket.on('laravel_database_user.status.updated', data => {
            const onlineUsersList = document.getElementById('online-users');
            onlineUsersList.innerHTML = '';

            data.forEach(userId => {
                const listItem = document.createElement('li');
                listItem.textContent = `User ${userId} is online`;
                onlineUsersList.appendChild(listItem);
            });
        });
    </script>
</body>
</html>
