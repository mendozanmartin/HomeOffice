import AState from "./AState";
import World, { WorldEvents } from "../game/World";
import Socket from "../socket";
import IUser from "../models/IUser";
import RTCManager from "../RTCManager";
import IJoinCall from "../models/ICall";
import IAnswerCall from "../models/IAnswer";

/**
 * Website StateManager
 * Control what pages are currently shown to the user
 */
export default class StateManager implements WorldEvents {

    public static Initialize() {
        this.instance = new StateManager();
        this.instance.World.setHandler(this.instance);
    }

    public static GetInstance = (): StateManager => {
        if (StateManager.instance === undefined) {
            throw new Error("Manager must be initialized must be ");
        }
        StateManager.instance.World.setHandler(StateManager.instance);
        return StateManager.instance!;
    }

    public World: World;
    public Socket: Socket;
    public RTCManager: RTCManager;

    private static instance?: StateManager;

    private stack: AState[] = [];

    private constructor() {
        this.RTCManager = new RTCManager();
        this.World = new World(this);
        this.Socket = new Socket(this.World);
    }

    requestMicrophoneAccess(): Promise<void> {
        return this.RTCManager.requestAudio()
    }

    joinCall(answer: IAnswerCall) {
        this.RTCManager.joinCall(answer)
            .then(() => console.log('success'))
            .catch((e) => console.log(e));
    }

    answerCall(offer: IJoinCall) {
        console.log("decideOffer", offer);
        if (!this.World.getUserById(offer.hostId).isHost) {
            console.log('user is not host, he cant accept a call');
            return;
        }
        this.RTCManager.setupRemoteRemoveDescription(offer.offer)
            .then(() => {
                this.RTCManager.requestAudio()
                    .then(() => {
                        this.RTCManager.createAnswer()
                            .then(answer => {
                                this.RTCManager.setupLocalDescription(answer)
                                    .then(() => {
                                        this.Socket.answerCall(offer.hostId, this.RTCManager.peerConnection.localDescription)
                                    })
                            })
                    })

            });
    }

    addUser(user: IUser) {
        console.log('makeOffer', user);
        if (user.isHost) {
            console.log('host cant make offer to himself');
            return
        }
        const me = this.World.getUserById(this.Socket.getSocketId())
        if (!me.isHost) {
            console.log('cant make offer, im not host')
            return
        }
        this.RTCManager.makeOffer()
            .then(offer => {
                this.RTCManager.setupLocalDescription(offer)
                    .then(() => this.Socket.offerCall(user.id, new RTCSessionDescription(offer)))
                    .catch(() => console.log('something happened'))
            })
    }

    /**
     * Push a new state onto the stack
     * @param state state to transfer to
     * @param hidePervious Should the current state be hidden
     */
    public async Push(state: AState, hideAllPervious: boolean = true) {
        if (this.stack.length > 0 && hideAllPervious) {
            this.stack[this.stack.length - 1].hide();
        }
        await state.show();
        this.stack.push(state);
    }

    /**
     * Pop the current state
     */
    public async Pop() {
        const state = this.stack.pop()!;
        state.hide();
        state.destroy();
        if (this.stack.length > 0) {
            const newState = this.stack[this.stack.length - 1];
            await newState.show();
        }
    }

    /**
     * Pop the current state and push a new one on
     * @param state state to transfer to
     */
    public async Swap(state: AState) {
        await this.Pop();
        await this.Push(state);
    }

    /**
     * Remove all states and transfer to the new one
     * @param state state to transfer to
     */
    public async ClearAndPush(state: AState) {
        while (this.stack.length !== 0) {
            await this.Pop();
        }
        await this.Push(state);
    }

}