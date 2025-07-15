import { diContainer } from "@fastify/awilix";
import { AutoLunchBotService } from "src/services/autoLunchBotService";
import { AsyncTask, CronJob } from "toad-scheduler";

export function autoStartLunchBot() {
  const jobName = "autoLunchBotServiceStart";

  const autoLunchBotService = diContainer.resolve<AutoLunchBotService>(
    "autoLunchBotService"
  );

  const task = new AsyncTask(
    jobName,
    async () => {
      await autoLunchBotService.start();
      setTimeout(() => {
        console.log("🔄 enabling AutoLunchBot after 60 seconds...");
        autoLunchBotService.toggleAutoLunchBot();
      }, 60 * 1000); // Wait 60 seconds before enabling the bot
    },
    (err: Error) => {
      console.log("🚀 ~ fastifyPlugin ~ err:", err);
    }
  );
  return new CronJob(
    {
      cronExpression: "0 6 * * 1-5",
      timezone: "America/Recife",
    },
    task
  );
}
