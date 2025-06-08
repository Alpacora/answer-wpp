import QRCode from "qrcode";

export async function generateQrCode(qrCode: string) {
  if (!qrCode) return;
  try {
    const mountedQrCode = await QRCode.toString(qrCode, {
      type: "terminal",
      small: true,
    });
    console.log("📲 QR Code:\n", mountedQrCode);
    const dataURL = await QRCode.toDataURL(qrCode);
    return dataURL;
  } catch (error) {
    console.error("🚀 ~ generateQrCode ~ error:", error);
  }
}
