import IUser from "./Types/IUser";

type Room = string;

interface UserDetails {
    room: Room;
    user: IUser;
}

class Game {

    private activeSockets: { [id: string]: UserDetails } = {};

    public setUserRoom(userId: string, room: Room) {
        let isHost = false;
        const users = this.getAllUsersInRoom(room);
        if (users.length === 0) {
            isHost = true;
        }
        this.activeSockets[userId] = {
            room,
            user: {
                id: userId,
                isHost,
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
        this.activeSockets[userId].user = { ...this.activeSockets[userId].user, ...user, ...{ id: userId } };
    }

    public getUserRoom(userId: string): string {
        return this.activeSockets[userId].room;
    }

    public getAllUsersInRoom(room: string): IUser[] {
        const a = Object.keys(this.activeSockets)
            .filter(k => this.activeSockets[k].room === room)
            .map(k => this.activeSockets[k]);

        console.log(JSON.stringify(a, null, 2))
        return a.map(k => k.user);
    }
}

export default Game;
