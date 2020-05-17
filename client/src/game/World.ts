import { SocketEvents } from "../socket";
import IUser from "../models/IUser";
import IJoinCall from "../models/ICall";
import IAnswerCall from "../models/IAnswer";

type Users = { [key: string]: IUser };

export interface WorldEvents {
    addUser(user: IUser);
    answerCall(offer: IJoinCall);
    joinCall(answer: IAnswerCall);
}

class World implements SocketEvents {

    private handler: WorldEvents;

    constructor(handler: WorldEvents) {
        console.log("Creating World");
        (window as any).users = {};
        this.handler = handler;
    }

    setHandler = (handler: WorldEvents) => {
        this.handler = handler;
    }

    userAnswered = (answer: IAnswerCall): void => {
        this.handler.joinCall(answer);
    }

    answerCall = (offer: IJoinCall): void => {
        this.handler.answerCall(offer);
    }

    initializeUsers(users: IUser[]): void {
        console.log("users", users);
        (window as any).users = users.reduce((obj, user) => {
            obj[user.id] = user;
            return obj;
        }, {});
    }

    addUser = (user: IUser): void => {
        console.log('before', (window as any).users[user.id]);
        (window as any).users[user.id] = { ...(window as any).users[user.id], ...user };
        console.log((window as any).users);
        console.log(this.handler);

        this.handler.addUser((window as any).users[user.id]);
    }

    removeUser(edit: IUser): void {
        (window as any).users[edit.id] = undefined;
        delete (window as any).users[edit.id];
        console.log((window as any).users);
    }

    getUserById(id: string): IUser {
        return (window as any).users[id];
    }

    handleError(error: any): void {
        throw new Error("Method not implemented.");
    }
}

export default World;