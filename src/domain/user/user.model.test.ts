import { User } from "./user.model";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

describe("User Model Unit test", () => {
  beforeEach(async () => {});

  it("should create a User instance", async () => {
    let newUser: User | Error = await User.create(
      "John Doe",
      "johndoe@email.com",
      "1234Hash",
    );

    if (newUser instanceof Error) {
      fail("The user was not created");
    }

    expect(newUser).toBeInstanceOf(User);
    expect(newUser.Name()).toBe("John Doe");
    expect(newUser.Email()).toBe("johndoe@email.com");
    expect(await bcrypt.compare("1234Hash", newUser.Password())).toBeTruthy();
  });

  it("should create throw error if a validation fail", async () => {
    let newUser = await User.create("John Doe", "johndoe@email", "1234Hash");
    if (newUser instanceof Error) {
      expect(newUser.message).toBe("Error: Invalid email format");
    } else {
      fail("The user was created with invalid email");
    }
  });

  it("should create throw error email already exist", async () => {
    let newUser = await User.create(
      "John Doe",
      "johndoe@email.com",
      "1234Hash",
    );

    if (newUser instanceof Error) {
      fail("The user was not created");
    }

    let user = await newUser.save();
    if (user instanceof Error) {
      expect(user.message).toBe("Error: email already exists");
    } else {
      fail("The user was stored with an existing email");
    }
  });
  afterAll(() => {});
});
