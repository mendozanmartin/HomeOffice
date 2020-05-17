import express, { Application } from "express";
import socketIO, { Server as SocketIOServer } from "socket.io";
import { createServer, Server as HTTPServer } from "https";
import Game from "./Game";
import IUser from "./Types/IUser";
import IMovement from "./Types/IMovement";

type OfferCall = {
    userId: string;
    offer: RTCSessionDescriptionInit;
}

type AnswerCall = {
    userId: string;
    answer: RTCSessionDescriptionInit;
}

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

        const privateKey = `
-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAqa2eaXPMDNQcVKSm4ACy4ExNHdNI7iJRIghnFyjKQYXldYbY
o9JnMXZQl2dQGyBrWlcOOYTQ8/Nc4FVAUatocM9BVIpv3fDXukHNuS0D5qGaLeGC
Fpl1d+JVOzMzcDUFtXDObZluJev7TrhixP7lw3aXlzKE5zQ7FiHZkkT91UqvhZ6V
/c0sIJqu9aso82IuXY8cWhoh3VVgJY7YnU7iTlxMSmvko5B7kWDDf9yMufhc5yyL
kWdNya6ZEJm1KwK0qH1KMHs6XtuMKFAXSw1KAUW9GiV21BMQSD9PsA72fsZR9t4E
SdehNSoaL4qTYxCzxdf0BxCQ5H0THZMy+kMRpwIDAQABAoIBAApH9dhH5u5ED+9l
BqN+B1il5upOuhWLyMS6I5z4oMC1n0CuygOrJQuPMrTp0qXCIh8YNUlw7cRKU69Y
GwyXyT1EoZ3AwaR+CmRDxnZY7uqTkicDigFajQ6VjTqIEK7U16K10hw79ruff9u2
Om3bUAq27dqAeiMUPBxMMsW1HnhE8++djEHII9kmA+RaaMyQJWJmrsmC9xoQxSTn
a7RS4IIRaSQ2eLUvjfafXLDAsOxDWoElRHFVPWOhvGV9wd+btpG0NZhpr/jrQszJ
WKI5MOJSI49s7d81Kr9ZPw0D11azmFZCh1Y5ambfmExzhHpkk4v7PQPUrkNS2jun
sKw3tEkCgYEA3H+63moVnM3R/zQYpT6yF+hA1s5NwFTv6sIkzFVdGwdCDk91S1zj
oUmAlANn5ylmVWhURXdSsLTVJKIlXetAueRHfh5e/900gmU93CjGc0Db/Y5gUGpY
RITY3NyMEOcRLZozsODjN4oabsMHnJ3K4bzHM5e0MCb5AyF/dtXB3IMCgYEAxP83
2vLH5NpeHo1FFE7VOW3CPIIUan3lei4QNKdymFlaHaRYFBvJmHK5viUkZ99U7d6o
dy/0l1ok0LvvMTCR8J5AzUFpPgNYiPP+Fw9VqNFd1FUiesrAJk6Fbn10Te4podMq
QU+BjlTeV0p8EgvL6qBBXD+LsN97lNG6GqhhdQ0CgYEAigL4t9W2iVraId49vtAr
MIOSceDXEZcYQ9wYpDyZ9hzo34QkanNNltomvH4VPr7O6o5OkNxKyYemETPcJ5jj
/nY/uVTRKV0PTL6JpY9wBxuFloLTDgJCFUEBa9wvXzUBr4Vg7UkVbuHmAYXY8dJh
9kDufgBqK+l42tjQq1TH7nkCgYAvFAcXLhoTWRRRHNW7arOOS+q1ZyjV4kxrDIMW
8kVynzfoCZR7CcD9y70T8fBnWnoDdsiv4ygC26ocsC0ThlX6OPenldA+37HS2OyK
OkHwXEieK9JXogiVnwJIS3b2AMq2P67DeOqvRxzzo3tPHL6Yzb+Q+ia6GE6CXDSr
lj3kKQKBgEubgun+m31fktbXUx6C//3rxRxV/zwxzbud8cQ8hFk3X90OiBGrql1J
jM1xtoHSqRzcE//OtOPuYGVUjsz+Wv+fO7C8cTrB04vZqTFV4ukdK3LbP/NZIPRT
8XzyOWE1BkEDAvCB1lSILz3rcwpdFroNK62gqonNceaVJmfd4sip
-----END RSA PRIVATE KEY-----`
        const certificate =
            `-----BEGIN CERTIFICATE-----
MIIC+jCCAeICCQCpVjSD5IzGaDANBgkqhkiG9w0BAQsFADA/MQswCQYDVQQGEwJD
QTELMAkGA1UECAwCT04xFDASBgNVBAcMC01pc3Npc3NhdWdhMQ0wCwYDVQQKDARB
bGVjMB4XDTIwMDUxNzAyMjUxMVoXDTMwMDUxNTAyMjUxMVowPzELMAkGA1UEBhMC
Q0ExCzAJBgNVBAgMAk9OMRQwEgYDVQQHDAtNaXNzaXNzYXVnYTENMAsGA1UECgwE
QWxlYzCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKmtnmlzzAzUHFSk
puAAsuBMTR3TSO4iUSIIZxcoykGF5XWG2KPSZzF2UJdnUBsga1pXDjmE0PPzXOBV
QFGraHDPQVSKb93w17pBzbktA+ahmi3hghaZdXfiVTszM3A1BbVwzm2ZbiXr+064
YsT+5cN2l5cyhOc0OxYh2ZJE/dVKr4Welf3NLCCarvWrKPNiLl2PHFoaId1VYCWO
2J1O4k5cTEpr5KOQe5Fgw3/cjLn4XOcsi5FnTcmumRCZtSsCtKh9SjB7Ol7bjChQ
F0sNSgFFvRoldtQTEEg/T7AO9n7GUfbeBEnXoTUqGi+Kk2MQs8XX9AcQkOR9Ex2T
MvpDEacCAwEAATANBgkqhkiG9w0BAQsFAAOCAQEAg9QQjB5PcnW0pcKuVyt647bW
dyhl2qSJLn2xVwa5w2O3Qyb/vSwf2XHsfEmgOeEHq9AS+xXZXa5txCRGfVmwTApK
OeI1//0Qnnc3fpHs7FLn461S9bpaQVlhtJ0vM0ZAOJgNg7ufkR/71V0Hy6QDGwyS
1v4X75U3yRkacQjzd5Z737UovpluMxHbT/CmHts0ix6cmzyAvClGPmwqm583mRn7
AMU/yIDzwT96fJveZ7/1bkeuKjye6A6WyXiOnfFZYgimDNRGou3O6zjn4oXJdG+Q
diYUXvuItbTTScYeli9+GaSRqkwjZvKQX4BrpviQKN9X87avXF5Afn/geHRNlQ==
-----END CERTIFICATE-----`
        const credentials = { key: privateKey, cert: certificate };
        this.httpServer = createServer(credentials, this.app);
        this.io = socketIO(this.httpServer);

        // register dependence's
        this.handleRoutes();
        this.handleDefaultSocketConnection();
    }

    private handleRoutes(): void {
        this.app.use(express.static('../client/dist/'))
        this.app.get("/", (req, res) => {
            res.send(`<h1>Hello World</h1>`);
        });
    }

    private handleDefaultSocketConnection(): void {
        this.io.on("connection", (socket) => {
            // join default room
            console.log(`${socket.id}: Socket connected to /`);
            socket.join("/")
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
                console.log(`${socket.id}: Socket added ${user.name} to room ${room}`)
                this.io.in(room).emit("user:added", user);
            });

            socket.on("channel:user:move", (movement: IMovement) => {
                this.game.updateUser(socket.id, movement);
                const user = this.game.getUserById(socket.id);
                const room = this.game.getUserRoom(socket.id);
                this.io.in(room).emit("user:moved", user.user);
            })

            socket.on("channel:user:offerCall", ({ userId, offer }: OfferCall) => {
                console.log(`User ${userId} has been offered a call by ${socket.id}`)
                socket.to(userId).emit("user:answerCall", {
                    offer: offer,
                    hostId: socket.id
                });
            })

            socket.on("channel:user:answerCall", ({ userId, answer }: AnswerCall) => {
                console.log(`User ${socket.id} has answered call by ${userId}`)
                socket.to(userId).emit("user:answered", {
                    userId: socket.id,
                    answer: answer
                });
            })

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
