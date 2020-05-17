import AState from "./AState";
import { GetElementById } from "../util/GetElemById";
import StateManager from "./StateManager";
import GameState from "./GameState";

export default class SetupState extends AState {

    private form: HTMLFormElement;
    private back: HTMLButtonElement;

    constructor() {
        super("setup");
        const state = StateManager.GetInstance();

        const nameInput = GetElementById("setup-name-input") as HTMLInputElement;
        nameInput.autofocus = true;

        const roomHeader = GetElementById("setup-room-header");
        roomHeader.textContent = `Entering room ${state.Socket.getRoom()}`;

        this.form = GetElementById("setup-form") as HTMLFormElement;
        this.form.addEventListener("submit", this.handleSubmit);

        this.back = GetElementById("setup-back") as HTMLButtonElement;
        this.back.addEventListener("click", this.leave);
    }

    /**
     * life cycle method
     * 
     * called when the screen will become no longer visible
     */
    public destroy() {
        console.log('destroying setup')
        StateManager.GetInstance().Socket.leave();
        this.form.removeEventListener("submit", this.handleSubmit);
        this.back.removeEventListener("click", this.leave);
    }

    handleSubmit = (event: Event) => {
        event.preventDefault();
        event.stopPropagation();

        let user = Object.values(this.form)
            .reduce((obj, field) => {
                if (field.name !== "") {
                    obj[field.name] = field.value;
                }
                return obj
            }, {});

        const socket = StateManager.GetInstance().Socket;
        user = { ...user, ...{ id: socket.getSocketId() } };
        console.log(user);
        socket.addUser(user);
        this.playGame();
    }

    leave = () => {
        StateManager.GetInstance().Pop();
    }

    playGame = () => {
        this.back.disabled = true;
        (GetElementById("setup-submit-btn") as any).disabled = true
        const id = StateManager.GetInstance().Socket.getSocketId();
        const me = StateManager.GetInstance().World.getUserById(id);
        console.log("me", me);
        if (me.isHost) {
            StateManager.GetInstance().requestMicrophoneAccess()
                .then(() => {
                    StateManager.GetInstance().Push(GameState.Create());
                }).catch(e => {
                    console.log(e);
                });
        } else {
            StateManager.GetInstance().Push(GameState.Create());
        }
    }
}
