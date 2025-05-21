import { Model, Optional } from "sequelize";

interface RolesProperties {
  id: string;
  name: string;
  description: string;
  entity: string;
  canRead: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canSoftDelete: boolean;
  canDelete: boolean;
  createdBy: string;
  updatedBy: string;
  deletedBy: string;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface RolesInput extends Optional<RolesProperties, "id"> {}
export interface RolesOutput extends Required<RolesProperties> {}

export class Roles
  extends Model<RolesProperties, RolesInput>
  implements RolesProperties
{
  public id!: string;
  public name!: string;
  public description!: string;
  public entity!: string;
  public canRead!: boolean;
  public canCreate!: boolean;
  public canUpdate!: boolean;
  public canSoftDelete!: boolean;
  public canDelete!: boolean;
  public createdBy!: string;
  public updatedBy!: string;
  public deletedBy!: string;
  public deleted!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt!: Date | null;

  public async getById(id: string): Promise<RolesOutput> {
    const role = await Roles.findByPk(id);
    if (!role) {
      throw new Error("Roles not found");
    }
    return role;
  }
}
