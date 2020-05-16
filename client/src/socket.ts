import { SERVER } from './constants';
import "socket.io-client";
import IUser from './models/IUser';

export interface SocketEvents {
    initializeUsers(users: IUser[]): void;
    addUser(user: IUser): void;
    removeUser(user: IUser): void;
    handleError(error: any): void
}

class Socket {

    private socket: SocketIOClient.Socket;
    private eventHandler: SocketEvents;

    constructor(handler: SocketEvents) {
        this.eventHandler = handler;
        this.socket = io.connect(SERVER);
        this.socket.on("connection", this.start);
    }

    public getSocketId(): string {
        return this.socket.id;
    }

    public moveToChannel(room: string) {
        this.socket.emit("channel:join", { room });
    }

    public addUser(user: IUser) {
        this.socket.emit("channel:user:add", user);
    }

    public leave() {
        this.socket.emit("channel:leave")
    }

    private start = (socket: SocketIOClient.Socket) => {
        socket.on("user:all", this.eventHandler.initializeUsers)
        socket.on("user:added", this.eventHandler.addUser)
        socket.on("user:remove", this.eventHandler.removeUser)
        socket.on("error", this.eventHandler.handleError)
    }
}

export default Socket;