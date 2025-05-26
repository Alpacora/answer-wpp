export function normalizeBens(normalizedMenu: string) {
  normalizedMenu = normalizedMenu.replace("preto", "feijão preto");
  normalizedMenu = normalizedMenu.replace("macassar", "feijão maccassar");
  normalizedMenu = normalizedMenu.replace("mulato", "feijão mulato");

  return normalizedMenu;
}

export function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
