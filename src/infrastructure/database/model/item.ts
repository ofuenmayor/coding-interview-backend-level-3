import { Model, Optional } from "sequelize";

interface ItemProperties {
  id: number;
  name: string;
  price: number;
  createdBy: string;
  updatedBy: string;
  deletedBy: string;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface ItemInput extends Optional<ItemProperties, "id"> {}
export interface ItemOutput extends Required<ItemProperties> {}

export class Item
  extends Model<ItemProperties, ItemInput>
  implements ItemProperties
{
  public id!: number;
  public name!: string;
  public price!: number;
  public createdBy!: string;
  public updatedBy!: string;
  public deletedBy!: string;
  public deleted!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt!: Date | null;

  public async persist(payload: ItemInput): Promise<ItemOutput> {
    const item = await Item.create(payload);
    return item.dataValues;
  }

  public async updateItem(id: number, payload: ItemInput): Promise<ItemOutput> {
    const item = await Item.findByPk(id);
    if (!item) {
      throw new Error("Item not found");
    }
    await item.update(payload);
    return item.dataValues;
  }

  public async softDelete(id: number): Promise<ItemOutput> {
    const item = await Item.findByPk(id);
    if (!item) {
      throw new Error("Item not found");
    }
    item.deleted = !item.deleted;
    item.deletedAt = new Date();
    await item.update(item);
    return item.dataValues;
  }

  public async getById(id: number): Promise<ItemOutput> {
    const item = await Item.findOne({ where: { id: id, deleted: false } });
    if (!item) {
      throw new Error("Item not found");
    }
    if (!item) {
      throw new Error("Item not found");
    }
    return item.dataValues;
  }

  public async findAll(): Promise<ItemOutput[]> {
    const resultArray = await Item.findAll({ where: { deleted: false } });
    let array = resultArray.map((item) => {
      return item.dataValues;
    });
    return array;
  }
}
