export function normalizeBeans(normalizedMenu: string) {
  normalizedMenu = normalizedMenu.replace("preto", "feijão preto");
  normalizedMenu = normalizedMenu.replace("macassar", "feijão macassar");
  normalizedMenu = normalizedMenu.replace("mulato", "feijão mulato");
  normalizedMenu = normalizedMenu.replace("mulatinho", "feijão mulatinho");

  return normalizedMenu;
}

export function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export * from "./choiceLunch";
export * from "./generateQrCode";
export * from "./logs";

