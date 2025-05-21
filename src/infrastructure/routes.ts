import { Server } from "@hapi/hapi";
import { UserApplication } from "../application/user.application";

export const defineRoutes = (server: Server) => {
  server.route({
    method: "GET",
    path: "/ping",
    handler: async (request, h) => {
      return {
        ok: true,
      };
    },
  });
  server.route({
    method: "GET",
    path: "/User/find/{email}",
    handler: async (request, h) => {
      return UserApplication.findByEmail(request.params.email);
    },
  });
  server.route({
    method: "POST",
    path: "/signUp",
    handler: async (request, h) => {
      const { email, name, password } = request.payload as any;
      return UserApplication.SignUp(email, name, password);
    },
  });

  server.route({
    method: "POST",
    path: "/login",
    handler: async (request, h) => {
      const { email, password } = request.payload as any;
      return UserApplication.Login(email, password);
    },
  });
};
