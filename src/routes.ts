import { FastifyInstance } from "fastify";
import { arrayOfLunchSchema, deleteLunchSchema } from "./schemas/lunchSchema";
import { chargeSchema, deleteChargeSchema } from "./schemas/chargeSchema";
import { ZodTypeProvider } from "fastify-type-provider-zod";

async function routes(fastify: FastifyInstance, options: Object) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  // Charges
  app.get("/charges", (request, reply) => {
    const controller = request.diScope.resolve("chargeController");
    return controller.getCharges(request, reply);
  });
  app.delete(
    "/charges/:id",
    {
      schema: {
        params: deleteChargeSchema,
      },
    },
    (request, reply) => {
      const controller = request.diScope.resolve("chargeController");
      return controller.deleteCharge(request, reply);
    }
  );
  app.post(
    "/charges",
    {
      schema: {
        body: chargeSchema,
      },
    },
    (request, reply) => {
      const controller = request.diScope.resolve("chargeController");
      return controller.createNewCharger(request, reply);
    }
  );

  // BOT
  app.get("/bot/qr-code", (request, reply) => {
    const controller = request.diScope.resolve("autoLunchBotController");
    return controller.generateQRCode(request, reply);
  });

  // Toggle
  app.get("/toggles", (request, reply) => {
    const controller = request.diScope.resolve("toggleController");
    return controller.getTogglesState(request, reply);
  });
  app.post("/toggles/bot", (request, reply) => {
    const controller = request.diScope.resolve("toggleController");
    return controller.toggleBot(request, reply);
  });
  app.post("/toggles/auto-lunch-bot", (request, reply) => {
    const controller = request.diScope.resolve("toggleController");
    return controller.toggleAutoLunchBot(request, reply);
  });
  app.post("/toggles/charge-bot", (request, reply) => {
    const controller = request.diScope.resolve("toggleController");
    return controller.toggleChargeBot(request, reply);
  });

  // Lunch
  app.get("/lunch", (request, reply) => {
    const controller = request.diScope.resolve("lunchController");
    return controller.getLunch(request, reply);
  });
  app.post(
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
  app.delete(
    "/lunch/:id",
    {
      schema: {
        params: deleteLunchSchema,
      },
    },
    (request, reply) => {
      const controller = request.diScope.resolve("lunchController");
      return controller.deleteLunch(request, reply);
    }
  );
}

export default routes;
