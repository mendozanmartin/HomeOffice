import StateManager from "./state/StateManager";
import LoginState from "./state/LoginState";

StateManager.Initialize();
StateManager.GetInstance().Push(new LoginState());

// 1. User logins into app
// 2. User connects to the socket "/"
// 3. User inputs the room he wants to connect to
// 4. User is connected into room
// 5. User adds him self
// 6. User clicks submit
// 7. User is now in game
// end. User can leave at any time
