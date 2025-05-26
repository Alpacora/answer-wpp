import { Boom } from "@hapi/boom";
import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import * as dotenv from "dotenv";
import P from "pino";
import QRCode from "qrcode";

import fs from "fs";
import { DAYS_OF_WEEK, NOT_REQUIRED_SIDES } from "./constants";
import firstWeek from "./menus/week_01.json";
import { normalizeBens } from "./utils";

dotenv.config();

const target = process.env.TARGET_WA_ID;

function choiceLunch(menu: string): string {
  const DATE = new Date();
  let lunchTodDay = undefined;
  let nextDay = 0;
  const normalizedMenu = normalizeBens(
    menu.toLowerCase().replaceAll("\n", " ")
  );
  console.log("🚀 ~ choiceLunch ~ normalizedMenu:", normalizedMenu);

  console.log("📅 Iniciando verificação de cardápio...");
  console.log("📄 Menu recebido:", menu);

  while (!lunchTodDay && nextDay < 7) {
    const dayIndex = DATE.getDay() + nextDay;

    if (dayIndex >= DAYS_OF_WEEK.length) {
      console.warn("⚠️ Índice de dia da semana fora do intervalo!");
      break;
    }

    const dayName = DAYS_OF_WEEK[dayIndex];
    console.log(`🔍 Verificando dia: ${dayName}`);

    const choice = firstWeek.week.find((element) => element.day === dayName);
    console.log("🚀 ~ choiceLunch ~ choice:", choice);

    if (!choice) {
      console.warn(`❌ Nenhuma entrada encontrada para o dia: ${dayName}`);
      nextDay++;
      continue;
    }

    const hasAllProteins = choice.proteins.every((protein) =>
      normalizedMenu.includes(protein.toLowerCase())
    );

    const hasAllSides = choice.sides.every((side) => {
      const includes = normalizedMenu.includes(side.toLowerCase());
      if (!includes && NOT_REQUIRED_SIDES.includes(side)) {
        return true;
      }

      return includes;
    });

    console.log(`🧪 Proteínas OK? ${hasAllProteins}`);
    console.log(`🧪 Acompanhamentos OK? ${hasAllSides}`);

    if (hasAllProteins && hasAllSides) {
      lunchTodDay = choice;
      console.log("✅ Dia de almoço encontrado:", lunchTodDay.day);
    } else {
      console.log("⏭️ Avançando para o próximo dia...");
      nextDay++;
    }
  }

  if (!lunchTodDay) {
    console.error("❌ Nenhum dia corresponde ao menu informado.");
    return "Não foi possível identificar o dia correspondente ao cardápio enviado.";
  }

  const message = `
Bom dia! 
🍱 Quentinha *Grande*:

🥩 *Proteínas*:
${lunchTodDay.proteins.map((protein) => `- ${protein}`).join("\n")}

🥗 *Acompanhamentos*:
${lunchTodDay.sides.map((side) => `- ${side}`).join("\n")}
  `.trim();

  console.log("📤 Mensagem gerada:\n", message);

  return message;
}

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(
    "/auth_info_baileys"
  );
  console.log(
    "📁 Lista de arquivos no volume:",
    fs.readdirSync("/auth_info_baileys")
  );

  const sock = makeWASocket({
    auth: state,
    logger: P(),
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      const mountedQrCode = await QRCode.toString(qr, {
        type: "terminal",
        small: true,
      });
      console.log("📲 RAW QR Code:\n", qr);
      console.log("📲 QR Code para login:\n", mountedQrCode);
    }

    if (
      connection === "close" &&
      (lastDisconnect?.error as Boom)?.output?.statusCode ===
        DisconnectReason.restartRequired
    ) {
      console.warn("🔄 Conexão fechada, reiniciando bot...");
      await startBot();
    } else if (connection === "open") {
      console.log("✅ Conectado ao WhatsApp com sucesso!");
    }
  });

  sock.ev.on("messages.upsert", async ({ type, messages }) => {
    if (type !== "notify") return;

    for (const message of messages) {
      console.log("🚀 ~ sock.ev.on ~ message:", message);
      const jid = message.key.remoteJid;
      console.log("🚀 ~ sock.ev.on ~ jid:", jid);
      console.log("🚀 ~ sock.ev.on ~ target:", target);
      const messageText =
        message.message?.conversation ||
        message.message?.extendedTextMessage?.text;

      console.log(`📩 Nova mensagem de ${message.pushName}`);

      if (jid === target) {
        const isMenu = messageText.includes("Cardápio");
        const confirmLunch = messageText.includes("Ok");

        if (isMenu) {
          console.log("📥 Menu identificado, processando...");
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
