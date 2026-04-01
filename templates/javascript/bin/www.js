import { httpServer, app } from "./../app.js";
import mongoose from "mongoose";
mongoose.set('strictQuery', false);

let normalizePort = (val) => {
    let port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
};

let onError = (error) => {
    if (error.syscall !== "listen") {
        throw error;
    }

    let bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.log(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.log(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
};

/**
 * Event listener for HTTP server 'listening' event.
 */

let onListening = () => {
    let addr = httpServer.address();
    let bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    console.log("Listening on " + bind);
};

/**
 * Get port from environment and store in Express.
 */
let port = normalizePort(process.env.PORT);
app.set("port", port);

// let server = createServer(app);


// MongoDB connection
const decryptDbUrl = process.env.DB_URL
MongodbConnection().catch(err => console.log(err));
async function MongodbConnection() {
    await mongoose.connect(decryptDbUrl);
    console.log(`Database is connected successfully.`);
}

httpServer.listen(port, function () {
    console.log("Express server listening on %d, in %s mode", process.env.PORT, app.get("env"));
});

httpServer.on("error", onError);
httpServer.on("listening", onListening);
