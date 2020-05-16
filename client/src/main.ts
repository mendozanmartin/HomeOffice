import StateManager from "./state/StateManager";
import LoginState from "./state/LoginState";


StateManager.GetInstance().Push(new LoginState());