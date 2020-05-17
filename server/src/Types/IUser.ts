import IMovement from "./IMovement";

interface IUser extends IMovement {
  id: string;
  color: string;
  pronoun: string;
  name: string;
  x: number;
  y: number;
}

export default IUser;
