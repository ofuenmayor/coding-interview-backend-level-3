import { Sequelize, DataTypes } from "sequelize";
import { Postgres } from "../postgres";

import { User, Item, Roles } from "./index";

interface DbModels {
  sequelize: Sequelize;
  User: typeof User;
  Roles: typeof Roles;
  Item: typeof Item;
  [key: string]: any;
}

const models: DbModels = {} as DbModels;

export const initializeModels = async (
  test: boolean = false,
): Promise<DbModels> => {
  const dbInstance = Postgres.getInstance();

  if (!(dbInstance as any).isInitialized) {
    await dbInstance.initialize();
  }

  const sequelizeConnection = dbInstance.getDbConnection();

  models.sequelize = sequelizeConnection;

  User.init(
    {
      id: {
        type: DataTypes.STRING,
        autoIncrement: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      lastLogin: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      createdBy: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastToken: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      updatedBy: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      deletedBy: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      sequelize: sequelizeConnection,
      paranoid: true,
      modelName: "User",
    },
  );
  models.User = User; // Almacena la clase User inicializada

  Roles.init(
    {
      id: {
        type: DataTypes.STRING,
        autoIncrement: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      entity: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      canRead: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      canUpdate: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      canCreate: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      canDelete: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      canSoftDelete: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      createdBy: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      updatedBy: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      deletedBy: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      sequelize: sequelizeConnection,
      paranoid: true,
      modelName: "Roles",
    },
  );
  models.Roles = Roles;

  Item.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      createdBy: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      updatedBy: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      deletedBy: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      sequelize: sequelizeConnection,
      paranoid: true,
      modelName: "Item",
    },
  );
  models.Item = Item;

  if (models.User && models.Roles) {
    Roles.hasMany(User);
  }

  if (test) {
    await sequelizeConnection.dropAllSchemas({ logging: false });
    await sequelizeConnection.sync({ force: true, logging: false });
  } else {
    await sequelizeConnection.sync({ alter: true, logging: false });
  }
  return models;
};

export type { User, Roles, Item };
