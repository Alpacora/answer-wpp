import fileSystem from "node:fs/promises";
import path from "node:path";

export async function logToFile(message: string) {
  const timestamp = new Date().toISOString();
  const fullMessage = `[${timestamp}] ${message}\n`;

  const logFilePath = path.join(
    process.cwd(),
    "auth_info_baileys",
    "logsData.txt"
  );

  try {
    await fileSystem.appendFile(logFilePath, fullMessage, "utf8");
  } catch (error) {
    console.error("🚀 ~ logToFile ~ error:", error);
  }
}
