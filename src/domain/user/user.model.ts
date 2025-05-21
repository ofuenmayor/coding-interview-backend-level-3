import {
  UserInput as Input,
  UserOutput as Output,
  User as Dal,
} from "../../infrastructure/database/model/user";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";

export class User {
  private output: Output;
  private constructor(input: Input) {
    this.output = input as Output;
  }

  public static async create(
    email: string,
    name: string,
    password: string,
  ): Promise<User | Error> {
    const id = randomUUID();
    const salt = bcrypt.genSaltSync(10);
    const encryPassword = bcrypt.hashSync(password, salt);

    if (!this.emailValidation(email)) {
      return new Error("Error: Invalid email format");
    }

    let userInput: Input = {
      id,
      name,
      email,
      password: encryPassword,
      createdBy: "system",
      createdAt: new Date(),
      updatedAt: new Date(),
      updatedBy: "system",
      deleted: false,
      deletedAt: null,
      deletedBy: "string",
      lastLogin: new Date(),
      lastToken: "",
    };

    return new User(userInput);
  }

  public static get(user: Output): User {
    user.password = "";
    return new User(user as Input);
  }

  public async save(): Promise<this | Error> {
    await Dal.create(this.output as Input);
    return new Error("Error: email already exists");
  }

  public static async Authenticate(
    email: string,
    password: string,
  ): Promise<User | Error> {
    const user: Output | Error = await new Dal().getByEmail(email);
    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
        return User.get(user);
      }
    }
    return Error("Error: Invalid email or password");
  }

  public Id(): string {
    return this.output.id;
  }
  public Name(): string {
    return this.output.name;
  }
  public Email(): string {
    return this.output.email;
  }
  public Password(): string {
    return this.output.password;
  }

  private static emailValidation(email: string): boolean {
    const emailRegex = /^([a-z0-9_\.+-]+\@[\da-z\.-]+\.[a-z\.]{2,6})$/;
    return emailRegex.test(email);
  }

  public static async findByEmail(email: string): Promise<User | Error> {
    const user: Output | Error = await new Dal().getByEmail(email);
    if (user instanceof Error) {
      return user;
    }
    return User.get(user);
  }
}
