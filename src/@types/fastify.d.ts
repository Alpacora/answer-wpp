import "@fastify/awilix";
import { ChargeController } from "../../src/controllers/chargeController";
import { AutoLunchBotController } from "../../src/controllers/autoLunchBotController";
import { ToggleController } from "../../src/controllers/toggleController";
import { LunchController } from "../../src/controllers/lunchController";
import { startBot } from "../../src/services/autoLunchBotService";
declare module "@fastify/awilix" {
  interface Cradle {
    chargeController: ChargeController;
    autoLunchBotController: AutoLunchBotController;
    toggleController: ToggleController;
    lunchController: LunchController;
    database: Db;
    autoLunchBotService: ReturnType<typeof startBot>;
  }
}
