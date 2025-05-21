import {
  RolesInput as Input,
  RolesOutput as Output,
  Roles as Dal,
} from "../../infrastructure/database/model";

export class Roles {
  private output: Output;
  private constructor(input: Input) {
    this.output = input as Output;
  }

  public static get(currency: Output): Roles {
    return new Roles(currency as Input);
  }
}
