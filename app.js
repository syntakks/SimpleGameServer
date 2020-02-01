var io = require('socket.io')(process.env.PORT || 52300); 

// Custom Classes
var Player = require('./models/Player')

console.log('Server has started!')

// Dictionary of our players. 
var players = []
var sockets = []

io.on('connection', function(socket) {
    console.log('Connection Made!')

    var player = new Player()
    var thisPlayerID = player.id

    players[thisPlayerID] = player
    sockets[thisPlayerID] = socket

     // Tell the client that this is our id for the server. 
    socket.emit('register', { id: thisPlayerID })
    socket.emit('spawn', player) // Tell myself that I have spawned.
    socket.broadcast.emit('spawn', player) // Tell others that I have spawned. 

    // Tell myself about everyone else in the game. 
    for (var playerID in players) {
        if (playerID != thisPlayerID) { //  Ignore self. 
            socket.emit('spawn', players[playerID])
        }
    }

    socket.on('disconnect', function() {
        console.log('A player has disconnected!')
        delete players[thisPlayerID]
        delete sockets[thisPlayerID]
        socket.broadcast.emit('disconnected', player)
    })
})