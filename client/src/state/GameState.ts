import AState from "./AState";
import Demo from "../game";
import { GetElementById } from "../util/GetElemById";
import StateManager from "./StateManager";

export default class GameState extends AState {
  public static async Create(): Promise<GameState> {
    const game = new GameState();
    const result = Promise.resolve(game);
    return result;
  }

  private game: Phaser.Game;
  private loginBtn: HTMLButtonElement;

  private constructor() {
    super("game");

    this.loginBtn = GetElementById("game-login-btn") as HTMLButtonElement;
    this.loginBtn.addEventListener("click", this.goToMainMenu);

    // Create the game here
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      backgroundColor: "#125555",
      width: 1000,
      height: 600,
      parent: "game-container",
      scene: Demo,
    };
    this.game = new Phaser.Game(config);
  }

  public destroy() {
    console.log("destroying game");
    this.loginBtn.removeEventListener("click", this.goToMainMenu);
    this.game.destroy(true);
  }

  goToMainMenu = () => {
    StateManager.GetInstance().Pop();
  };
}
