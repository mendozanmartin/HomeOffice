import express, { Application } from "express";
import socketIO, { Server as SocketIOServer } from "socket.io";
import { createServer, Server as HTTPServer } from "http";
import Game from "./Game";
import IUser from "./Types/IUser";
import IMovement from "./Types/IMovement";

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
      socket.join("/");
      this.game.setUserRoom(socket.id, "/");

      socket.on("channel:join", ({ room }) => {
        console.log(`${socket.id}: Socket connected to room ${room}`);
        socket.join(room);
        this.game.setUserRoom(socket.id, room);
        const users = this.game.getAllUsersInRoom(room);
        socket.emit("user:all", users);
      });

      socket.on("channel:user:add", (user: IUser) => {
        this.game.setUserDetails(socket.id, user);
        const room = this.game.getUserRoom(socket.id);
        console.log(`${socket.id}: Socket added ${user.name} to room ${room}`);
        this.io.in(room).emit("user:added", user);
      });

      socket.on("channel:user:move", (data) => {
        const user = this.game.getUserById(socket.id);
        const updatedUser = {
          ...user.user,
          ...data.movement,
          ...data.position,
        };
        this.game.updateUser(socket.id, updatedUser);
        const room = this.game.getUserRoom(socket.id);
        this.io.in(room).emit("user:moved", updatedUser);
      });

      socket.on("channel:leave", () => {
        const room = this.game.getUserRoom(socket.id);
        console.log(`${socket.id}: Socket left from ${room} for /`);
        socket.join("/");
        this.io.in(room).emit("user:remove", { userId: socket.id });
        this.game.setUserRoom(socket.id, "/");
      });

      socket.on("disconnect", () => {
        const room = this.game.getUserRoom(socket.id);
        console.log(`${socket.id}: Socket disconnected from ${room}`);
        this.io.in(room).emit("user:remove", { userId: socket.id });
        this.game.removeUser(socket.id);
      });
    });
  }

  public listen(callback: (port: number) => void): void {
    this.httpServer.listen(this.port, () => callback(this.port));
  }
}
