import { FastifyInstance } from "fastify";
import { z } from "zod";

async function routes(fastify: FastifyInstance, options: Object) {
  // Charges
  fastify.get("/charges", (request, reply) => {
    const controller = request.diScope.resolve("chargeController");
    return controller.getCharges(request, reply);
  });
  fastify.delete(
    "/charges/:id",
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
      },
    },
    (request, reply) => {
      const controller = request.diScope.resolve("chargeController");
      return controller.deleteCharge(request, reply);
    }
  );
  fastify.post(
    "/charges",
    {
      schema: {
        body: z.object({
          firstName: z.string(),
          lastName: z.string(),
          phone: z.string(),
          message: z.string(),
        }),
      },
    },
    (request, reply) => {
      const controller = request.diScope.resolve("chargeController");
      return controller.createNewCharger(request, reply);
    }
  );

  // BOT
  fastify.post("/bot/lunch/start", (request, reply) => {
    const controller = request.diScope.resolve("autoLunchBotController");
    return controller.startBotHandler(request, reply);
  });
  fastify.delete("/bot/lunch/stop", (request, reply) => {
    const controller = request.diScope.resolve("autoLunchBotController");
    return controller.stopBotHandler(request, reply);
  });
}

export default routes;
