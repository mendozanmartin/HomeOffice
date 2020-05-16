import AState from "./AState";
import World from "../game/World";
import Socket from "../socket";

/**
 * Website StateManager
 * Control what pages are currently shown to the user
 */
export default class StateManager {

    public static Initialize() {
        const world = new World();
        const socket = new Socket(world);
        this.instance = new StateManager(world, socket);
    }

    public static GetInstance = (): StateManager => {
        if (StateManager.instance === undefined) {
            throw new Error("Manager must be initialized must be ");
        }
        return StateManager.instance!;
    }

    public World: World;
    public Socket: Socket;

    private static instance?: StateManager;

    private stack: AState[] = [];

    private constructor(world: World, socket: Socket) {
        this.World = world;
        this.Socket = socket;
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