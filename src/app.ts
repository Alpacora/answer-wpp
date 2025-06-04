import { Boom } from "@hapi/boom";
import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import * as dotenv from "dotenv";
import P from "pino";

import {
  choiceLunch,
  generateQrCode
} from "@utils";
import path from "node:path";

dotenv.config();

const AUTH_PATH = path.join(__dirname, "../auth_info_baileys");
const target = process.env.TARGET_WA_ID?.split("@")[0];

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

      const jid = (message.key.participant || message.key.remoteJid)?.split(
        "@"
      )[0];

      console.log("🚀 ~ sock.ev.on ~ jid:", jid);
      console.log("🚀 ~ sock.ev.on ~ target:", target);

      const messageText =
        message.message?.conversation ||
        message.message?.extendedTextMessage?.text;

      if (jid === target) {
        const isMenu = messageText.includes("Cardápio");
        const confirmLunch = messageText.includes("Ok");

        if (isMenu) {
          const response = choiceLunch(messageText);
          await sock.sendMessage(jid, { text: response });
        }

        if (confirmLunch) {
          console.log("✅ Almoço confirmado pelo usuário!");
          // TODO: Make a payment
        }
      }
    }
  });
}

startBot();
