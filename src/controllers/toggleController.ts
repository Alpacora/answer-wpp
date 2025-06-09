import { FastifyReply, FastifyRequest } from "fastify";
import { AutoLunchBotService } from "src/services/autoLunchBotService";

export class ToggleController {
  autoLunchBotService: AutoLunchBotService;

  constructor({
    autoLunchBotService,
  }: {
    autoLunchBotService: AutoLunchBotService;
  }) {
    this.autoLunchBotService = autoLunchBotService;
  }

  async toggleChargeBot(request: FastifyRequest, reply: FastifyReply) {
    const isEnabledBot = this.autoLunchBotService.isRunning();

    if (!isEnabledBot) {
      return reply.code(400).send({
        statusCode: 400,
        code: "BOT_TURNED_OFF",
        error: "Bad Request",
        message: "The bot is turned off, wake up the bot first",
      });
    }

    const isEnabledAutoCharge = this.autoLunchBotService.toggleChargeBot();

    if (isEnabledAutoCharge) {
      await this.autoLunchBotService.stop();
      await this.autoLunchBotService.start();
    }

    reply.status(200).send({
      isEnabledAutoCharge,
    });
  }

  async toggleAutoLunchBot(request: FastifyRequest, reply: FastifyReply) {
    const isEnabledBot = this.autoLunchBotService.isRunning();

    if (!isEnabledBot) {
      return reply.code(400).send({
        statusCode: 400,
        code: "BOT_TURNED_OFF",
        error: "Bad Request",
        message: "The bot is turned off, wake up the bot first",
      });
    }

    const isEnabledAutoLunchBot = this.autoLunchBotService.toggleAutoLunchBot();

    reply.status(200).send({
      isEnabledAutoLunchBot,
    });
  }

  getTogglesState(request: FastifyRequest, reply: FastifyReply) {
    const isEnableBot = this.autoLunchBotService.isRunning();
    const isEnabledAutoLunch = this.autoLunchBotService.isAutoLunchBotEnabled();
    const isEnabledAutoCharge = this.autoLunchBotService.isChargeBotEnabled();

    reply.status(200).send({
      isEnableBot,
      isEnabledAutoLunch,
      isEnabledAutoCharge,
    });
  }

  async toggleBot(request: FastifyRequest, reply: FastifyReply) {
    if (this.autoLunchBotService.isRunning()) {
      await this.autoLunchBotService.stop(true);
      reply.code(200).send({
        isEnabledBot: false,
      });
      return;
    }
    await this.autoLunchBotService.start();
    reply.code(200).send({
      isEnabledBot: true,
    });
  }
}
