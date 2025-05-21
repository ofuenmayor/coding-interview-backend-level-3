import { Item } from "../domain";

export class ItemApplication {
  public static async findAll() {
    const items = await Item.getAll();
    return items;
  }

  public static async create(name: string, price: number) {
    const payload = await Item.create(undefined, name, price);
    if (!(payload instanceof Item)) {
      return payload;
    }
    const newItem = await payload.save();
    if (newItem instanceof Error) {
      return newItem;
    }
    return {
      id: newItem.Id(),
      name: newItem.Name(),
      price: newItem.Price(),
    };
  }
  public static async getById(id: number) {
    const item = await Item.getById(id);
    if (item instanceof Error) {
      return item;
    }
    return { id: item.Id(), name: item.Name(), price: item.Price() };
  }

  public static async delete(id: number) {
    const item = await Item.delete(id);
    if (item instanceof Error) {
      return item;
    }
    return { deleted: true };
  }

  public static async update(id: number, name: string, price: number) {
    const payload = await Item.create(id, name, price);
    if (!(payload instanceof Item)) {
      return payload;
    }
    const item = await payload.update(payload.getProperties(), id);
    if (item instanceof Error) {
      return item;
    }
    return {
      id: item.Id(),
      name: item.Name(),
      price: item.Price(),
    };
  }
}
