import AState from "./AState";
import { GetElementById } from "../util/GetElemById";
import StateManager from "./StateManager";
import GameState from "./GameState";

export default class LoginState extends AState {

  private channelInput: HTMLInputElement;
  private playBtn: HTMLButtonElement;

  constructor() {
    super("login");
    this.channelInput = GetElementById("login-channel") as HTMLInputElement;
    this.playBtn = GetElementById('login-play') as HTMLButtonElement;
    this.playBtn.addEventListener('click', this.playGame);
  }

  /**
   * life cycle method
   * 
   * called when the screen will become no longer visible
   */
  public destroy() {
    console.log('destroying login')
    this.playBtn.removeEventListener("click", this.playGame);
  }

  playGame = async () => {
    StateManager.GetInstance().Socket.moveToChannel(this.channelInput.value)
    StateManager.GetInstance().Push(await GameState.Create());
  }
}
