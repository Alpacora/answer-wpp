import "@fastify/awilix";
import { AutoLunchBotController } from "src/controllers/autoLunchBotController";
import { startBot } from "src/services/autoLunchBotService";
declare module "@fastify/awilix" {
  interface Cradle {
    chargeController: ChargeController;
    autoLunchBotController: AutoLunchBotController;
    database: Db;
    autoLunchBotService: ReturnType<typeof startBot>;
  }
}
