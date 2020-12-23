const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const port = process.env.PORT || 3000;

http.listen(port, () => {
    console.log(`Listening on *:${port}`);
});

const username = {};

function getRandomNumber(min, max)
{
    var n = Math.floor(Math.random() * (max - min) + min);     // Random no b/w 0 to 16
    return n;
}

function getRandomColor()
{
    var characters = '0123456789ABCDEF';
    var color = '#';

    for(var i = 0; i < 6; i++)
    {
        color += characters[getRandomNumber(0, 15)];
    }

    return color;
}

const userColor = {};

io.on('connection', (socket) => {

    socket.on('user-connected', (name) => {
        username[socket.id] = name;
        userColor[socket.id] = getRandomColor();
        var message = ' joined the chat';
        io.emit('show-status', message, name);       
    });

    // Server will send message to all other users except the one who has sent the message.
    socket.on('message', (data) => {
        socket.broadcast.emit('message', data, userColor[socket.id]);
    });

    socket.on('disconnect', () => {
        var message = ' left the chat';
        io.emit('show-status', message, username[socket.id]);       
        delete username[socket.id];
        delete userColor[socket.id];
    });

    socket.on('typing', () => {
        socket.broadcast.emit('show-typing', username[socket.id]);
    });

   socket.on('stopped-typing', () => {
        socket.broadcast.emit('hide-typing');
   });

});