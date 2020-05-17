import IMovement from "./IMovement";

interface IUser extends IMovement {
  id: string;
  color: string;
  pronoun: string;
  isHost: boolean;
  radius: number;
  name: string;
  x: number;
  y: number;
}

export default IUser;
