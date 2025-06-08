import { logToFile, normalizeBeans, randomIntFromInterval } from "@utils";
import makeWASocket from "@whiskeysockets/baileys";
import { NOT_REQUIRED_SIDES } from "../constants";
import choiceMenu from "../menus/max_healthy_lunch_combinations.json";

export function choiceLunch(menu: string): string {
  let lunchTodDay = undefined;
  let attempts = 1;
  const MAX_ATTEMPTS = choiceMenu.week.length;
  const normalizedMenu = normalizeBeans(
    menu.toLowerCase().replaceAll("\n", " ")
  );

  console.log("📄 Menu sanitizado recebido:", normalizedMenu);
  console.log("📅 Iniciando verificação de cardápio...");

  while (!lunchTodDay && attempts < MAX_ATTEMPTS) {
    const randomNumber = randomIntFromInterval(1, MAX_ATTEMPTS);

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
    console.log("🚀 ~ choiceLunch ~ lunchTodDay: FAILS");
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

export async function sendsChosenLunch(
  sock: ReturnType<typeof makeWASocket>,
  messageText: string,
  jidNumber: string
) {
  const target = process.env.TARGET_WA_ID?.split("@")[0];
  console.log("🚀 ~ target:", target);

  if (jidNumber === target) {
    const isMenu = messageText.includes("Cardápio");
    const confirmLunch = messageText.includes("Ok");

    if (isMenu) {
      const response = choiceLunch(messageText);
      await sock.sendMessage(`${jidNumber}@s.whatsapp.net`, {
        text: response,
      });
    }

    if (confirmLunch) {
      console.log("✅ Almoço confirmado pelo usuário!");
      sock.end(new Error("Lunch chosen"));
    }
  }
}
