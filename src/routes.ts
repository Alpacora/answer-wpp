import { FastifyInstance } from "fastify";
import { z } from "zod";
import { arrayOfLunchSchema } from "./schemas/lunchSchema";

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
          payday: z.number().min(1).max(31),
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
  fastify.get("/bot/qr-code", (request, reply) => {
    const controller = request.diScope.resolve("autoLunchBotController");
    return controller.generateQRCode(request, reply);
  });

  // Toggle
  fastify.get("/toggles", (request, reply) => {
    const controller = request.diScope.resolve("toggleController");
    return controller.getTogglesState(request, reply);
  });
  fastify.post("/toggles/bot", (request, reply) => {
    const controller = request.diScope.resolve("toggleController");
    return controller.toggleBot(request, reply);
  });
  fastify.post("/toggles/auto-lunch-bot", (request, reply) => {
    const controller = request.diScope.resolve("toggleController");
    return controller.toggleAutoLunchBot(request, reply);
  });
  fastify.post("/toggles/charge-bot", (request, reply) => {
    const controller = request.diScope.resolve("toggleController");
    return controller.toggleChargeBot(request, reply);
  });

  // Lunch
  fastify.get("/lunch", (request, reply) => {
    const controller = request.diScope.resolve("lunchController");
    return controller.getLunch(request, reply);
  });
  fastify.post(
    "/lunch",
    {
      schema: {
        body: arrayOfLunchSchema,
      },
    },
    (request, reply) => {
      const controller = request.diScope.resolve("lunchController");
      return controller.createNewLunch(request, reply);
    }
  );
}

export default routes;
