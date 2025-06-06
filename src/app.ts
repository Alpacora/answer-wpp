import { Boom } from "@hapi/boom";
import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import * as dotenv from "dotenv";
import P from "pino";

import { generateQrCode, sendsChosenLunch } from "@utils";
import path from "node:path";

dotenv.config();

const AUTH_PATH = path.join(__dirname, "../auth_info_baileys");

console.log("🚀 ~ authPath:", AUTH_PATH);

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_PATH);

  const sock = makeWASocket({
    auth: state,
    logger: P(),
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    generateQrCode(qr);

    const restartBot =
      connection === "close" &&
      (lastDisconnect?.error as Boom)?.output?.statusCode ===
        DisconnectReason.restartRequired;

    if (restartBot) {
      console.warn("🔄 Conexão fechada, reiniciando bot...");
      await startBot();
    } else if (connection === "open") {
      console.log("✅ Conectado ao WhatsApp com sucesso!");
    }
  });

  sock.ev.on("messages.upsert", async ({ type, messages }) => {
    if (type !== "notify") return;

    for (const message of messages) {
      console.log(`📩 Nova mensagem de ${message.pushName}`);

      console.log("📩 ~ sock.ev.on ~ message:", message);

      const jidNumber = (
        message.key.participant || message.key.remoteJid
      )?.split("@")[0];

      console.log("🚀 ~ sock.ev.on ~ jid:", jidNumber);

      const messageText =
        message.message?.conversation ||
        message.message?.extendedTextMessage?.text;

      sendsChosenLunch(sock, messageText, jidNumber);
    }
  });
}

startBot();
