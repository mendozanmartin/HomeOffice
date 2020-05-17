import "phaser";
import StateManager from "./state/StateManager";
import IUser from "./models/IUser";

interface IUserSprite {
    nameText: Phaser.GameObjects.Text;
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
            const id = StateManager.GetInstance().Socket.getSocketId();
            const me = StateManager.GetInstance().World.getUserById(id);
            const position = { x: me.x, y: me.y };
            StateManager.GetInstance().Socket.moveUser(this.movement, position);
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
            const id = StateManager.GetInstance().Socket.getSocketId();
            const me = StateManager.GetInstance().World.getUserById(id);
            const position = { x: me.x, y: me.y };
            StateManager.GetInstance().Socket.moveUser(this.movement, position);
        });
    }

    update() {
        let users = StateManager.GetInstance().World.getUsers();
        let keys = users.map(u => u.id)
        // remove
        let newAvatars = {};
        let wasRemoved = false;
        Object.keys(this.avatars).forEach(key => {
            if (!keys.includes(key)) {
                this.avatars[key].userRadius.destroy();
                this.avatars[key].userCircle.destroy();
                this.avatars[key].nameText.destroy();
                wasRemoved = true;
            }
            newAvatars[key] = this.avatars[key];
        })
        if (wasRemoved) {
            this.avatars = newAvatars;
        }

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
            this.moveUser(users[i]);
            avatar.userCircle.setX(users[i].x);
            avatar.userRadius.setX(users[i].x);
            avatar.nameText.setX(users[i].x + 500);
            avatar.userCircle.setY(users[i].y);
            avatar.userRadius.setY(users[i].y);
            avatar.nameText.setY(users[i].y + 450);
        }
    }

    private createAvatar(user: IUser): IUserSprite {
        console.log(user.color);
        const color = parseInt(user.color.toLocaleLowerCase().replace(/^#/, ''), 16);
        console.log(color);
        const point = new Phaser.Geom.Point(user.x + 500, user.y + 500);

        const userRadius = this.add.graphics();
        userRadius.lineStyle(2, color, 1);
        userRadius.strokeCircle(point.x, point.y, user.radius);

        const userCircle = this.add.graphics();
        userCircle.fillStyle(color, 1.0);
        userCircle.fillCircle(point.x, point.y, 16);

        var style = { font: "24px Arial", fill: user.color };
        const nameText = this.add.text(point.x + 500, point.y + 450, user.name, style);
        nameText.setOrigin(0.5);

        return { userCircle, userRadius, nameText }
    }

    private moveUser(user: IUser) {
        const moveAmt = 5;
        if (user.right) user.x += moveAmt; //move in direction of arrow keys
        if (user.left) user.x += -moveAmt;
        if (user.up) user.y += -moveAmt;
        if (user.down) user.y += moveAmt;
    }
}
