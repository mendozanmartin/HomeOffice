import { SERVER } from './constants';
import "socket.io-client";
import IUser from './models/IUser';

type SocketEvent<T> = [string, IUser]

export interface SocketEvents {
    initializeUsers(users: IUser[]): void;
    addUser(user: IUser): void;
    removeUser(user: IUser): void;
    handleError(error: any): void
}

class Socket {

    private socket: SocketIOClient.Socket;
    private eventHandler: SocketEvents;
    private room: string;

    constructor(handler: SocketEvents) {
        this.eventHandler = handler;
        this.socket = io.connect(SERVER);
        this.socket.on("user:all", this.eventHandler.initializeUsers)
        this.socket.on("user:added", this.eventHandler.addUser)
        this.socket.on("user:remove", this.eventHandler.removeUser)
        this.socket.on("error", this.eventHandler.handleError)
        this.room = "/";
    }

    public getSocketId(): string {
        return this.socket.id;
    }

    public getRoom(): string {
        return this.room;
    }

    public moveToChannel(room: string) {
        this.room = room;
        this.socket.emit("channel:join", { room });
    }

    public addUser(user: IUser) {
        this.socket.emit("channel:user:add", user);
    }

    public leave() {
        this.socket.emit("channel:leave")
    }
}

export default Socket;