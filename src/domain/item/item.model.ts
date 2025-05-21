import {
  ItemInput as Input,
  ItemOutput as Output,
  Item as Dal,
} from "../../infrastructure/database/model";

interface ItemResponse {
  id: number;
  name: string;
  price: number;
}

interface ValidationError extends Error {
  field: string;
  message: string;
}
export class Item {
  private output: Output;
  private constructor(input: Input, id?: number) {
    this.output = input as Output;
    if (id) {
      this.output.id = id;
    }
  }

  public static async create(
    id: number | undefined,
    name: string,
    price: number,
  ): Promise<Item | Error[]> {
    const errors = Item.itemValidator(price);
    if (errors.length > 0) {
      return errors;
    }
    name = name != undefined ? name : "";

    let input: Input = {
      name,
      price,
      createdBy: "system",
      createdAt: new Date(),
      updatedAt: new Date(),
      updatedBy: "system",
      deleted: false,
      deletedAt: null,
      deletedBy: "string",
    };

    return new Item(input, id);
  }

  public static itemValidator(price: number): Error[] {
    let errors: Error[] = [];
    if (!price) {
      errors.push({
        field: "price",
        message: 'Field "price" is required',
      } as ValidationError);
      return errors;
    }
    if (price < 0) {
      errors.push({
        field: "price",
        message: 'Field "price" cannot be negative',
      } as ValidationError);

      return errors;
    }
    return errors;
  }

  public static get(item: Output, id: number | undefined = undefined): Item {
    return new Item(item as Input, id);
  }

  public getProperties(): Output {
    return this.output;
  }

  public async save(): Promise<Item | Error> {
    const storeItem = await new Dal().persist(this.output as Input);
    if (storeItem instanceof Error) {
      return storeItem;
    }
    const createdItem = Item.get(storeItem as Output, storeItem.id);

    if (createdItem instanceof Error) {
      return new Error("Error: Item not found");
    }
    return createdItem as Item;
  }

  public async update(payload: Input, id: number): Promise<Item | Error> {
    const updatedItem = await new Dal().updateItem(id, payload as Input);
    if (updatedItem instanceof Error) {
      return updatedItem;
    }
    const createdItem = Item.get(updatedItem as Output, updatedItem.id);

    if (createdItem instanceof Error) {
      return new Error("Error: Item not found");
    }
    return createdItem as Item;
  }

  public static async delete(id: number): Promise<boolean | Error> {
    const updatedItem = await new Dal().softDelete(id);
    if (updatedItem instanceof Error) {
      return updatedItem;
    }
    const item = Item.get(updatedItem as Output, updatedItem.id);

    if (item instanceof Error) {
      return new Error("Error: Item not found");
    }
    return true;
  }

  public Id(): number {
    return this.output.id;
  }
  public Name(): string {
    return this.output.name;
  }
  public Price(): number {
    return this.output.price;
  }

  public static async getAll(): Promise<ItemResponse[]> {
    const items = await new Dal().findAll();
    let response: ItemResponse[] = [];
    if (items.length > 0) {
      await Promise.all(
        items.map((item) => {
          response.push({
            id: item.id,
            name: item.name,
            price: item.price,
          });
        }),
      );
    }
    return response;
  }

  public static async getById(id: number): Promise<Item | Error> {
    try {
      const item = await new Dal().getById(id);
      return Item.get(item as Output);
    } catch (err) {
      return Error("Item not found");
    }
  }
}
