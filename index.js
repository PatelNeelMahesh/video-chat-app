// start with ### npm init -y
// this is going to be our server

// dependencies for client(front end)
// @material-ui/core @material-ui/icons
// react-copy-to-clipboard simple-peer socket.io-client

// cors: for cross origin request
// express: to start the server
// nodemon: refresh the server when we make changes
// socket.io: real-time data transition i.e. message,video,audio

// to run the server ### nodemon index.js

const app = require("express")(); //we are calling express here
const server = require("http").createServer(app); // http is a build in node module here we are creating the server
const cors = require("cors"); //middleware pkg we are gonna use to enable cross origin request

const io = require("socket.io")(server, {
    cors: {
        origin:"*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req,res) => {
    res.send('Server is running.')
});

io.on('connection', (socket) => {
    
    socket.emit('me', socket.id);
    
    socket.on('disconnect', () => {
        socket.broadcast.emit("callended");
    })

    socket.on("calluser", ({userToCall, signalData, from, name}) => {
        io.to(userToCall).emit("calluser", { signal: signalData, from, name});
    })

    socket.on("answercall", (data) => {
        io.to(data.to).emit("callaccepted", data.signal);
    })
});

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));