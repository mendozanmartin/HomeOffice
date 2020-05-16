import express, { Application } from "express";
import socketIO, { Server as SocketIOServer } from "socket.io";
import { createServer, Server as HTTPServer } from "http";
import Game from "./Game";
import IUser from "./Types/IUser";

export class Server {
    private httpServer: HTTPServer;
    private app: Application;
    private io: SocketIOServer;
    private game: Game;

    private readonly port: number;

    constructor(port: number) {
        // initialize
        this.port = port;
        this.game = new Game();
        this.app = express();
        this.httpServer = createServer(this.app);
        this.io = socketIO(this.httpServer);

        // register dependence's
        this.handleRoutes();
        this.handleDefaultSocketConnection();
    }

    private handleRoutes(): void {
        this.app.get("/", (req, res) => {
            res.send(`<h1>Hello World</h1>`);
        });
    }

    private handleDefaultSocketConnection(): void {
        this.io.on("connection", (socket) => {
            // join default room
            console.log(`${socket.id}: Socket connected to /.`);
            socket.join("/")
            this.game.setUserRoom(socket.id, "/");

            socket.on("channel:join", ({ room }) => {
                // join room
                console.log(`${socket.id}: Socket connected to room ${room}`)
                socket.join(room);
                this.game.setUserRoom(socket.id, room);
                this.game.getAllUsersInRoom(room);
                socket.in(room).emit("user:all")
            });

            socket.on("channel:user:add", (user: IUser) => {
                this.game.setUserDetails(socket.id, user);
                const room = this.game.getUserRoom(socket.id);
                console.log(`${socket.id}: Socket added user to room ${room}`)
                socket.in(room).emit("user:added", user);
            })

            socket.on("channel:leave", () => {
                const room = this.game.getUserRoom(socket.id);
                console.log(`${socket.id}: Socket left from ${room} for /`);
                socket.join("/")
                socket.in(room).emit("user:remove", { userId: socket.id })
                this.game.setUserRoom(socket.id, "/");
            })

            socket.on("disconnect", () => {
                const room = this.game.getUserRoom(socket.id);
                console.log(`${socket.id}: Socket disconnected from ${room}`)
                socket.in(room).emit("user:remove", { userId: socket.id })
                this.game.removeUser(socket.id);
            });
        });
    }

    public listen(callback: (port: number) => void): void {
        this.httpServer.listen(this.port, () =>
            callback(this.port)
        );
    }
}
