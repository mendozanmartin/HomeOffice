import "phaser";
import StateManager from "./state/StateManager";
import IUser from "./models/IUser";

interface IUserSprite {
    userCircle: Phaser.GameObjects.Graphics;
    userRadius: Phaser.GameObjects.Graphics;
}

type Avatars = { [id: string]: IUserSprite }

export default class Demo extends Phaser.Scene {

    private avatars: Avatars = {};
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private movement = {
        up: false,
        down: false,
        left: false,
        right: false,
    };

    constructor() {
        super("demo");
        console.log(this);
    }

    preload() {
        this.load.image("avatar", "assets/blue dot.png");
    }

    create() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.on("keydown", (event) => {
            if (event.code === "ArrowUp") {
                this.movement.up = true;
            } else if (event.code === "ArrowDown") {
                this.movement.down = true;
            } else if (event.code === "ArrowRight") {
                this.movement.right = true;
            } else if (event.code === "ArrowLeft") {
                this.movement.left = true;
            }
            // StateManager.GetInstance().Socket.moveUser(this.movement);
        });

        this.input.keyboard.on("keyup", (event) => {
            if (event.code === "ArrowUp") {
                this.movement.up = false;
            } else if (event.code === "ArrowDown") {
                this.movement.down = false;
            } else if (event.code === "ArrowRight") {
                this.movement.right = false;
            } else if (event.code === "ArrowLeft") {
                this.movement.left = false;
            }
            // StateManager.GetInstance().Socket.moveUser(this.movement);
        });
    }

    update() {
        let users = StateManager.GetInstance().World.getUsers();
        for (let i = 0; i < users.length; i++) {
            let user = users[i];
            if (!user) {
                continue;
            }
            // if the avatar doesn't exist, create it
            if (!this.avatars[user.id]) {
                this.avatars[user.id] = this.createAvatar(user);
            }
            const avatar = this.avatars[user.id];
            // avatar.userCircle.clear();
            // avatar.userRadius.clear();

            this.moveUser(users[i]);

            avatar.userCircle.setX(users[i].x);
            avatar.userRadius.setX(users[i].x);
            avatar.userCircle.setY(users[i].y);
            avatar.userRadius.setY(users[i].y);

            avatar.userRadius.stroke();
            avatar.userCircle.stroke();
        }
    }

    private createAvatar(user: IUser): IUserSprite {
        const color = parseInt(user.color.toLocaleLowerCase().replace(/^#/, ''), 16);
        const point = new Phaser.Geom.Point(user.x, user.y);

        const userRadius = this.add.graphics();
        userRadius.lineStyle(2, color, 0.8);
        userRadius.strokeCircle(point.x, point.y, 50);

        const userCircle = this.add.graphics();
        userCircle.fillStyle(color, 1);
        userCircle.strokeCircle(point.x, point.y, 10);

        return { userCircle, userRadius }
    }

    private moveUser(user: IUser) {
        const moveAmt = 1;
        if (this.cursors.right.isDown) user.x += moveAmt; //move in direction of arrow keys
        if (this.cursors.left.isDown) user.x += -moveAmt;
        if (this.cursors.up.isDown) user.y += -moveAmt;
        if (this.cursors.down.isDown) user.y += moveAmt;
    }
}
