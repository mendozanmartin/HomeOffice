import "phaser";

export default class Demo extends Phaser.Scene {
  user = {
    up: false,
    down: false,
    left: false,
    right: false,
  };
  avatar: any;
  cursors: any;

  constructor() {
    super("demo");
    console.log(this);
  }

  preload() {
    this.load.image("avatar", "assets/blue dot.png");
  }

  create() {
    this.avatar = this.physics.add.sprite(500, 400, "avatar");
    this.cursors = this.input.keyboard.createCursorKeys();

    this.input.keyboard.on("keydown", (event) => {
      console.log(event);
      if (event.code === "ArrowUp") {
        this.user.up = true;
      } else if (event.code === "ArrowDown") {
        this.user.down = true;
      } else if (event.code === "ArrowRight") {
        this.user.right = true;
      } else if (event.code === "ArrowLeft") {
        this.user.left = true;
      }
    });

    this.input.keyboard.on("keyup", (event) => {
      console.log(event);
      if (event.code === "ArrowUp") {
        this.user.up = false;
      } else if (event.code === "ArrowDown") {
        this.user.down = false;
      } else if (event.code === "ArrowRight") {
        this.user.right = false;
      } else if (event.code === "ArrowLeft") {
        this.user.left = false;
      }
    });
  }

  update() {
    const moveAmt = 200;
    this.avatar.setDrag(2000);
    if (this.cursors.right.isDown) this.avatar.setVelocityX(moveAmt); //move in direction of arrow keys
    if (this.cursors.left.isDown) this.avatar.setVelocityX(-moveAmt);
    if (this.cursors.up.isDown) this.avatar.setVelocityY(-moveAmt);
    if (this.cursors.down.isDown) this.avatar.setVelocityY(moveAmt);
  }
}
