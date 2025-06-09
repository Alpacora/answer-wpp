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

  generateQRCode(request: FastifyRequest, reply: FastifyReply) {
    const qrCode = this.autoLunchBotService.getQrCodeDataURL();
    const base64Data = qrCode.replace(/^data:image\/png;base64,/, "");
    reply.header("Content-Type", "image/png");
    return Buffer.from(base64Data, "base64");
  }
}
