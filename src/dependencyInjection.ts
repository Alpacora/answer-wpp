import { diContainer } from "@fastify/awilix";
import { asClass, asValue, Lifetime } from "awilix";
import fastifyPlugin from "fastify-plugin";
import { AutoLunchBotController } from "./controllers/autoLunchBotController";
import { ChargeController } from "./controllers/chargeController";
import { ToggleController } from "./controllers/toggleController";
import { AutoLunchBotService } from "./services/autoLunchBotService";

export default fastifyPlugin((fastify) => {
  diContainer.register({
    autoLunchBotService: asClass(AutoLunchBotService, {
      lifetime: Lifetime.SINGLETON,
    }),
    database: asValue(fastify.mongo.db),
    chargeController: asClass(ChargeController, {
      lifetime: Lifetime.SINGLETON,
    }),
    autoLunchBotController: asClass(AutoLunchBotController, {
      lifetime: Lifetime.SINGLETON,
    }),
    toggleController: asClass(ToggleController, {
      lifetime: Lifetime.SINGLETON,
    }),
  });
});
