import { User } from "../domain";

export class UserApplication {
  public static async findByEmail(email: string) {
    return User.findByEmail(email);
  }
  public static async SignUp(email: string, name: string, password: string) {
    const newUser = await User.create(email, name, password);
    if (newUser instanceof Error) {
      return newUser;
    }
    await newUser.save();
    return newUser;
  }

  public static async Login(email: string, password: string) {
    return User.Authenticate(email, password);
  }
}
