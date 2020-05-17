import AState from "./AState";
import Demo from "../game";
import { GetElementById } from "../util/GetElemById";
import StateManager from "./StateManager";

export default class GameState extends AState {

  public static Create(): GameState {
    const game = new GameState();
    const result = game;
    return result;
  }

  private redis: HTMLInputElement;
  private game: Phaser.Game;

  constructor() {
    super("game");

    this.redis = GetElementById("game-redis") as HTMLInputElement;
    this.redis.addEventListener("change", this.editRedis);

    // Create the game here
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      backgroundColor: "#E2EBE8",
      width: 1024,
      height: 768,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      parent: "game-container",
      scene: Demo,
      physics: {
        default: "arcade",
      },
    };
    this.game = new Phaser.Game(config);
  }

  editRedis = (ev) => {
    StateManager.GetInstance().Socket.editRedis(ev.target.value)
  }

  public destroy() {
    console.log('destroying game');
    this.game.destroy(true);
  }
}
