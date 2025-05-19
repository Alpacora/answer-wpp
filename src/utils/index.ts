export function normalizeBens(normalizedMenu: string) {
  normalizedMenu = normalizedMenu.replace("preto", "feijão preto");
  normalizedMenu = normalizedMenu.replace("macassar", "feijão maccassar");
  normalizedMenu = normalizedMenu.replace("mulato", "feijão mulato");

  return normalizedMenu;
}
