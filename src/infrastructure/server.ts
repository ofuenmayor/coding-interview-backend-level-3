import Hapi from "@hapi/hapi";
import { defineRoutes } from "./routes";
import { Postgres } from "./database/postgres";
import { Models } from "./database/model/index";
import { ItemRoutes } from "./routes/index";

const getServer = () => {
  const server = Hapi.server({
    host: "0.0.0.0",
    port: 3001,
  });

  ItemRoutes(server);
  defineRoutes(server);

  return server;
};

async function initializeServer() {
  const server = getServer();
  const instance = Postgres.getInstance();
  await instance.resetForTests();
  await Models.initializeModels(true);
  await server.initialize();
  return server;
}
export const shutdown = async (server: any) => {
  try {
    if (server) {
      console.log("Stopping Hapi server...");
      await server.stop({ timeout: 10000 });
      console.log("Hapi server stopped.");
    }
    const instance = Postgres.getInstance();
    await instance.closeConnection();

    process.exit(0);
  } catch (err) {
    console.error("Error during graceful shutdown:", err);
    process.exit(1);
  }
};

async function startServer() {
  const server = getServer();
  await Postgres.getInstance().initialize();
  await Models.initializeModels();
  console.log(`Server running on ${server.info.uri}`);
  await server.start();
  process.on("SIGINT", async () => {
    await shutdown(server);
  });

  process.on("SIGTERM", async () => {
    await shutdown(server);
  });
  return server;
}

export { startServer, initializeServer };
