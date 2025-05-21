import { Model, Optional } from "sequelize";

interface UserProperties {
  id: string;
  name: string;
  email: string;
  password: string;
  createdBy: string;
  updatedBy: string;
  deletedBy: string;
  deleted: boolean;
  createdAt: Date;
  lastLogin: Date;
  lastToken: string;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface UserInput extends Optional<UserProperties, "id"> {}
export interface UserOutput extends Required<UserProperties> {}

export class User
  extends Model<UserProperties, UserInput>
  implements UserProperties
{
  public id!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public createdBy!: string;
  public updatedBy!: string;
  public deletedBy!: string;
  public lastToken!: string;
  public deleted!: boolean;
  public createdAt!: Date;
  public lastLogin!: Date;
  public updatedAt!: Date;
  public deletedAt!: Date | null;

  public async create(payload: UserInput): Promise<UserOutput> {
    const user = await User.create(payload);
    return user.dataValues;
  }

  public async updateUser(id: string, payload: UserInput): Promise<UserOutput> {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error("User not found");
    }
    await user.update(payload);
    return user.dataValues;
  }

  public async softDelete(id: string, payload: UserInput): Promise<UserOutput> {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error("User not found");
    }
    user.deleted = !user.deleted;
    await user.update(payload);
    return user.dataValues;
  }

  public async getById(id: string): Promise<UserOutput> {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user.dataValues;
  }

  public async getByEmail(email: string): Promise<UserOutput> {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      throw new Error("User not found");
    }
    return user.dataValues;
  }
}
