import { Sequelize, Dialect } from "sequelize";

export class Postgres {
  private static instance: Postgres;

  private connection: Sequelize | undefined;

  private isInitialized = false;

  private constructor() {
    const name = process.env.DATABASE_NAME || "eld-items";
    const user = process.env.DATABASE_USER || "eldorado";
    const password = process.env.DATABASE_PASSWORD || "eldoradoAdmin";
    const host = process.env.DATABASE_HOST || "localhost";
    const port = process.env.DATABASE_PORT || "5432";
    const dialect = (process.env.DATABASE_DRIVER || "postgres") as Dialect;

    try {
      this.connection = new Sequelize(name, user, password, {
        host: host,
        port: parseInt(port, 10),
        dialect: dialect,
        logging: false,
      });
    } catch (error) {
      process.exit(1);
    }
  }

  public static getInstance(): Postgres {
    if (!Postgres.instance) {
      Postgres.instance = new Postgres();
    }
    return Postgres.instance;
  }
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }
    if (!this.connection) {
      throw new Error("La instancia de Sequelize no se creó correctamente.");
    }
    try {
      await this.connection.authenticate();
      this.isInitialized = true;
    } catch (error) {
      this.connection = undefined;
      this.isInitialized = false;
      throw new Error(
        "Error al conectar a la base de datos: " + (error as Error).message,
      );
    }
  }

  public getDbConnection(): Sequelize {
    if (!this.connection || !this.isInitialized) {
      throw new Error(
        "La conexión a la base de datos no ha sido inicializada. Llama a initialize() primero.",
      );
    }
    return this.connection;
  }

  public async closeConnection(): Promise<void> {
    if (this.connection && this.isInitialized) {
      try {
        await this.connection.close();
        this.connection = undefined;
        this.isInitialized = false;
      } catch (error) {
        throw error;
      }
    }
  }
  public async resetForTests(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.close(); // Cierra la conexión existente
      } catch (error) {}
    }
    Postgres.instance = new Postgres(); // Crea una NUEVA instancia interna del singleton
    this.connection = undefined;
    this.isInitialized = false;
  }
}
