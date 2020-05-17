import { SERVER } from './constants';
import IUser from './models/IUser';
import IJoinCall from './models/ICall';
import IAnswerCall from './models/IAnswer';
import IMovement from './models/IMovement';

type SocketEvent<T> = [string, IUser]

export interface SocketEvents {
    initializeUsers(users: IUser[]): void;
    addUser(user: IUser): void;
    removeUser(user: IUser): void;
    userMoved(user: IUser): void;
    answerCall(offer: IJoinCall): void;
    userAnswered(answer: IAnswerCall): void;
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
        this.socket.on("user:moved", this.eventHandler.userMoved);
        this.socket.on("user:remove", this.eventHandler.removeUser)
        this.socket.on("user:answerCall", this.eventHandler.answerCall);
        this.socket.on("user:answered", this.eventHandler.userAnswered);
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

    public moveUser(movement: IMovement) {
        this.socket.emit("channel:user:move", movement);
    }

    public offerCall(userId: string, offer: RTCSessionDescription) {
        this.socket.emit("channel:user:offerCall", { userId, offer: offer.toJSON() })
    }

    public answerCall(hostId: string, answer: RTCSessionDescriptionInit) {
        this.socket.emit("channel:user:answerCall", { userId: hostId, answer: answer })
    }

    public leave() {
        this.socket.emit("channel:leave")
    }
}

export default Socket;