import { diContainer } from "@fastify/awilix";
import { asClass, asValue, Lifetime } from "awilix";
import fastifyPlugin from "fastify-plugin";
import { AutoLunchBotController } from "./controllers/autoLunchBotController";
import { ChargeController } from "./controllers/chargeController";
import { LunchController } from "./controllers/lunchController";
import { ToggleController } from "./controllers/toggleController";
import { AutoLunchBotService } from "./services/autoLunchBotService";

export default fastifyPlugin((fastify) => {
  diContainer.register({
    database: asValue(fastify.mongo.db),
    autoLunchBotService: asClass(AutoLunchBotService, {
      lifetime: Lifetime.SINGLETON,
    }),
    chargeController: asClass(ChargeController, {
      lifetime: Lifetime.SINGLETON,
    }),
    autoLunchBotController: asClass(AutoLunchBotController, {
      lifetime: Lifetime.SINGLETON,
    }),
    toggleController: asClass(ToggleController, {
      lifetime: Lifetime.SINGLETON,
    }),
    lunchController: asClass(LunchController, {
      lifetime: Lifetime.SINGLETON,
    }),
  });
});
