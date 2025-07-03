import { diContainer } from "@fastify/awilix";
import { AutoLunchBotService } from "src/services/autoLunchBotService";
import { AsyncTask, CronJob } from "toad-scheduler";

export function autoStopLunchBot() {
  const jobName = "autoLunchBotServiceStart";

  const autoLunchBotService = diContainer.resolve<AutoLunchBotService>(
    "autoLunchBotService"
  );

  const task = new AsyncTask(
    jobName,
    async () => {
      await autoLunchBotService.stop();
    },
    (err: Error) => {
      console.log("🚀 ~ fastifyPlugin ~ err:", err);
    }
  );
  return new CronJob(
    {
      cronExpression: "0 9 * * 1-5",
      timezone: "America/Recife",
    },
    task
  );
}
