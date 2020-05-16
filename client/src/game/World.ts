import { SocketEvents } from "../socket";
import IUser from "../models/IUser";

type Users = { [key: string]: IUser };

class World implements SocketEvents {

    private users: Users;

    constructor() {
        console.log("Creating World");
        this.users = {};
    }

    initializeUsers(users: IUser[]): void {
        console.log("users", users);
        this.users = users.reduce((obj, user) => {
            obj[user.id] = user;
            return obj;
        }, {});
    }

    addUser(user: IUser): void {
        this.users[user.id] = user;
        console.log(this.users);
    }

    removeUser(edit: IUser): void {
        this.users[edit.id] = undefined;
        delete this.users[edit.id];
        console.log(this.users);
    }

    handleError(error: any): void {
        throw new Error("Method not implemented.");
    }
}

export default World;