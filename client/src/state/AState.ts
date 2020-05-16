import { GetElementById } from "../util/GetElemById";

export default abstract class AState {

    protected parentElement: HTMLDivElement;
    private id: string;

    /**
     * Create a new state that will be managed by our state manager class
     * @param id html id
     */
    constructor(id: string) {
        this.parentElement = GetElementById(id) as HTMLDivElement;
        this.id = id;
    }

    /**
     * Hide the current page
     */
    public hide() {
        console.log(`hiding ${this.id}`);
        this.parentElement.style.display = "none";
    }

    /**
     * Show the page
     *
     * {return} boolean - hide the last page shown
     *      to hide the previous state, return true
     *      to keep the last state visible, return false
     */
    public async show(): Promise<boolean> {
        console.log(`showing ${this.id}`);
        this.parentElement.style.display = "block";
        return Promise.resolve(true);
    }

    public isShowing(): boolean {
        return this.parentElement.style.display === "block";
    }

    /**
     * Remove any event listeners binded to the page
     */
    public abstract destroy();
}