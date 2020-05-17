import IMovement from "./IMovement";
import IPosition from "./IPosition";

interface IUser extends IMovement, IPosition {
    id: string;
    isHost: boolean;
    color: string;
    pronoun: string;
    name: string;
}

export default IUser;