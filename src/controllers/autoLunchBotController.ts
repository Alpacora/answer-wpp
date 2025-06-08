import { FastifyReply, FastifyRequest } from "fastify";
import { AutoLunchBotService } from "src/services/autoLunchBotService";

export class AutoLunchBotController {
  autoLunchBotService: AutoLunchBotService;

  constructor({
    autoLunchBotService,
  }: {
    autoLunchBotService: AutoLunchBotService;
  }) {
    this.autoLunchBotService = autoLunchBotService;
  }

  async startBotHandler(request: FastifyRequest, reply: FastifyReply) {
    if (this.autoLunchBotService.isRunning()) {
      reply.code(204).send();
      return;
    }
    await this.autoLunchBotService.start();
    reply.code(204).send();
  }

  async stopBotHandler(request: FastifyRequest, reply: FastifyReply) {
    if (!this.autoLunchBotService.isRunning()) {
      reply.code(204).send();
      return;
    }
    await this.autoLunchBotService.stop();
    reply.code(204).send();
  }
}
