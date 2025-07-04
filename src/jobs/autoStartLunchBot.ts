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
      await autoLunchBotService.toggleAutoLunchBot();
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
