import StateManager from "./state/StateManager";
import LoginState from "./state/LoginState";
import GameState from "./state/GameState";

StateManager.GetInstance().Push(new GameState());
