import "@fastify/awilix";
import { AutoLunchBotController } from "src/controllers/autoLunchBotController";
import { ToggleController } from "src/controllers/toggleController";
import { startBot } from "src/services/autoLunchBotService";
declare module "@fastify/awilix" {
  interface Cradle {
    chargeController: ChargeController;
    autoLunchBotController: AutoLunchBotController;
    toggleController: ToggleController;
    database: Db;
    autoLunchBotService: ReturnType<typeof startBot>;
  }
}
