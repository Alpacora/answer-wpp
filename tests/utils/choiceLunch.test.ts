import { describe, expect, it } from "vitest";
import { choiceLunch } from "../../src/utils";

describe("Choice Lunch", () => {
  const sanitizedMenu =
    "*bom dia !*  *reserva só com pagamento antecipado*  chave pix: 81986106719 nome: eduardo sebastião   *estaremos atendendo aqui no whatsapp até as 09:00 em ponto*🚨🚨🚨🚨🚨  *quentinha pequena: 12 reais* *quentinha média: 14 reias* *quentinha grande: 17 reais*  *cardápio de hoje 04/06/2025*  parmegiana de frango bife acebolado pastelão  costela no bafo strogonoff de frango  charque assada galinha guisada  cupim  peixe ao molho  lasanha de carne  galinha assada creme de bacalhau    *feijoes:* feijão preto feijão macassar  mulatinho   *acompanhamento:* arroz macarrão salada de folhas salada de salada de maionese repolho refogado  purê legumes  batata palha   reservas de almoço só até as *09:00 em ponto* 📝 depois disso, só preparando seu almoço na praça.";
  it.each(Array.from({ length: 100 }))(
    "should choice lunch from menu - Execution nº %#",
    () => {
      const message = choiceLunch(sanitizedMenu);
      expect(message).toBeTruthy();
    }
  );
});
