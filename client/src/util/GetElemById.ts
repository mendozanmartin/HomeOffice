export function GetElementById(id: string): HTMLElement {
    const temp = document.getElementById(id);
    if (temp == null) {
        throw new Error(`Div element [${id}] must exist for game to work!`);
    }
    return temp;
}