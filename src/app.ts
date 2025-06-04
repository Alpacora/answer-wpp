import { Boom } from "@hapi/boom";
import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import * as dotenv from "dotenv";
import P from "pino";

import {
  generateQrCode,
  logToFile,
  normalizeBeans,
  randomIntFromInterval,
} from "@utils";
import path from "node:path";
import { NOT_REQUIRED_SIDES } from "./constants";
import choiceMenu from "./menus/max_healthy_lunch_combinations.json";

dotenv.config();

const AUTH_PATH = path.join(__dirname, "../auth_info_baileys");
const target = process.env.TARGET_WA_ID?.split("@")[0];

console.log("🚀 ~ authPath:", AUTH_PATH);

function choiceLunch(menu: string): string {
  let lunchTodDay = undefined;
  let attempts = 1;
  const MAX_ATTEMPTS = 100;
  const normalizedMenu = normalizeBeans(
    menu.toLowerCase().replaceAll("\n", " ")
  );

  console.log("📄 Menu sanitizado recebido:", normalizedMenu);
  console.log("📅 Iniciando verificação de cardápio...");

  while (!lunchTodDay && attempts < MAX_ATTEMPTS) {
    const randomNumber = randomIntFromInterval(1, 100);

    console.log(`🔍 Verificando posição sorteada: ${randomNumber}`);

    const choice = choiceMenu.week.find(
      (element) => element.day === randomNumber.toString()
    );
    console.log("🚀 ~ choiceLunch ~ choice:", choice);

    if (!choice) {
      console.warn(
        `❌ Nenhuma entrada encontrada para o index: ${randomNumber}`
      );
      attempts++;
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

      logToFile(
        `Almoço escolhido no dia ${new Date().toLocaleDateString(
          "pt-br"
        )} : ${randomNumber}`
      );

      break;
    } else {
      console.log("⏭️ Avançando para o próximo dia...");
      attempts++;
    }

    if (attempts >= MAX_ATTEMPTS) {
      logToFile(
        `Após ${attempts} tentativas, nenhuma combinação de almoço foi feita`
      );
    }
  }

  if (!lunchTodDay) {
    console.error("❌ Nenhum dia corresponde ao menu informado.");
    return;
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
