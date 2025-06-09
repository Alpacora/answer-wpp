import makeWASocket from "@whiskeysockets/baileys";

export function sendsChargeMessage(
  sock: ReturnType<typeof makeWASocket>,
  contacts: any[]
) {
  // const today = new Date();
  // const year = today.getFullYear();
  // const month = today.getMonth();

  // const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

  // if (today.getDate() !== lastDayOfMonth) return;

  contacts.forEach(async (contact) => {
    await sock.sendMessage(`${contact.phone}@s.whatsapp.net`, {
      text: contact.message,
    });
  });
}
