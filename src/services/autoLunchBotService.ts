import { Boom } from "@hapi/boom";
import { generateQrCode, sendsChosenLunch } from "@utils";
import { sendsChargeMessage } from "@utils/sendsChargeMessage";
import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import { Db } from "mongodb";
import path from "node:path";
import P from "pino";

const AUTH_PATH = path.join(__dirname, "../../auth_info_baileys");

export class AutoLunchBotService {
  COLLECTION_TO_CONNECT: string = "contacts";
  LUNCH_COLLECTION_TO_CONNECT: string = "lunch";
  private enableChargeBot: boolean = false;
  private enableAutoLunchBot: boolean = false;
  private qrCodeDataURL: string = "";
  private sock: ReturnType<typeof makeWASocket> | undefined;
  private readonly database: Db;

  constructor({ database }: { database: Db }) {
    this.database = database;
  }

  async start() {
    const { state, saveCreds } = await useMultiFileAuthState(AUTH_PATH);

    const sock = makeWASocket({
      auth: state,
      logger: P(),
    });

    this.sock = sock;

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect, qr } = update;

      this.qrCodeDataURL = await generateQrCode(qr);

      const restartBot =
        connection === "close" &&
        (lastDisconnect?.error as Boom)?.output?.statusCode ===
        DisconnectReason.restartRequired;

      if (restartBot) {
        console.warn("🔄 Conexão fechada, reiniciando bot...");
        await this.start();
      } else if (connection === "open") {
        console.log("✅ Conectado ao WhatsApp com sucesso!");

        if (this.enableChargeBot) {
          const today = new Date().getDate();
          const collection = this.database.collection(
            this.COLLECTION_TO_CONNECT
          );
          const contacts = await collection.find({ payday: today }).toArray();
          console.log("🚀 ~ AutoLunchBotService ~ start ~ contacts:", contacts);

          sendsChargeMessage(sock, contacts);
        }
      }
    });

    sock.ev.on("messages.upsert", async ({ type, messages }) => {
      if (type !== "notify") return;

      for (const message of messages) {

        const jidNumber = (
          message.key.participant || message.key.remoteJid
        )?.split("@")[0];

        console.log(`📩 Nova mensagem de ${message.pushName} - ${jidNumber}`);

        const messageText =
          message.message?.conversation ||
          message.message?.extendedTextMessage?.text;

        if (!messageText || !jidNumber) {
          return;
        }

        if (this.enableAutoLunchBot) {
          sendsChosenLunch(sock, messageText, jidNumber, this.database);
        }
      }
    });
  }

  async stop(shutdownAll: boolean = false) {
    if (this.sock) {
      console.log("🛑 Parando o bot...");
      if (shutdownAll) {
        this.enableChargeBot = false;
        this.enableAutoLunchBot = false;
      }
      this.sock.end(new Error("Shutdown..."));
      this.sock = undefined;
    } else {
      console.warn("⚠️ Bot não está ativo.");
    }
  }

  isRunning(): boolean {
    return !!this.sock;
  }

  getQrCodeDataURL(): string {
    return this.qrCodeDataURL;
  }

  toggleChargeBot(): boolean {
    this.enableChargeBot = !this.enableChargeBot;
    return this.enableChargeBot;
  }

  toggleAutoLunchBot(): boolean {
    this.enableAutoLunchBot = !this.enableAutoLunchBot;
    return this.enableAutoLunchBot;
  }

  isChargeBotEnabled(): boolean {
    return this.enableChargeBot;
  }

  isAutoLunchBotEnabled(): boolean {
    return this.enableAutoLunchBot;
  }
}
