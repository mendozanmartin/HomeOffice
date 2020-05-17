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

    userRedis(user: IUser) {
        (window as any).users[user.id] = user
    }

    userMoved(user: IUser): void {
        (window as any).users[user.id] = user
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

    removeUser({ userId }: { userId: string }): void {
        const u = Object.keys((window as any).users)
            .map(k => (window as any).users[k])
            .filter(u => u.id !== userId)
            .reduce((obj, user) => {
                obj[user.id] = user;
                return obj;
            }, {});
        (window as any).users = u;
        console.log("removed", u);
    }

    getUserById(id: string): IUser {
        return (window as any).users[id];
    }

    getUsers(): IUser[] {
        return Object.keys((window as any).users).map(k => (window as any).users[k])
    }

    handleError(error: any): void {
        throw new Error("Method not implemented.");
    }
}

export default World;