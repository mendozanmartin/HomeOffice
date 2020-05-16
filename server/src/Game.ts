import IUser from "./Types/IUser";

type Room = string;

interface UserDetails {
    room: Room;
    user: IUser;
}

class Game {

    private activeSockets: { [id: string]: UserDetails } = {};

    public setUserRoom(userId: string, room: Room) {
        this.activeSockets[userId] = {
            room,
            user: {
                id: userId,
                color: "",
                name: "",
                pronoun: "",
            }
        };
    }

    public removeUser(userId: string) {
        delete this.activeSockets[userId];
    }

    public setUserDetails(userId: string, user: IUser) {
        this.activeSockets[userId].user = { ...user, ...{ id: userId } };
    }

    public getUserRoom(userId: string): string {
        return this.activeSockets[userId].room;
    }

    public getAllUsersInRoom(room: string): IUser[] {
        return Object.keys(this.activeSockets)
            .filter(k => this.activeSockets[k].room === room)
            .map(k => this.activeSockets[k].user)
    }
}

export default Game;
