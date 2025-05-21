import { Server } from "@hapi/hapi";
import { ItemApplication } from "../../application/item.application";

const baseUrl: string = "/items";

export const ItemRoutes = (server: Server) => {
  server.route({
    method: "GET",
    path: "/items",
    handler: async (request, h) => {
      return ItemApplication.findAll();
    },
  });

  server.route({
    method: "GET",
    path: `${baseUrl}/{id}`,
    handler: async (request, h) => {
      const response = await ItemApplication.getById(request.params.id);
      if (response instanceof Error) {
        return h.response({ error: response.message }).code(404);
      }
      return h.response(response).code(200);
    },
  });

  server.route({
    method: "DELETE",
    path: `${baseUrl}/{id}`,
    handler: async (request, h) => {
      await ItemApplication.delete(request.params.id);
      return h.response().code(204);
    },
  });
  server.route({
    method: "POST",
    path: `${baseUrl}`,
    handler: async (request, h) => {
      const { name, price } = request.payload as any;

      const item = await ItemApplication.create(name, price);
      if (item instanceof Array) {
        return h.response({ errors: item }).code(400);
      }
      return h.response(item).code(201);
    },
  });

  server.route({
    method: "PUT",
    path: `${baseUrl}/{id}`,
    handler: async (request, h) => {
      const { name, price } = request.payload as any;

      const item = await ItemApplication.update(request.params.id, name, price);
      if (item instanceof Array) {
        return h.response({ errors: item }).code(400);
      }
      return h.response(item).code(200);
    },
  });
};
