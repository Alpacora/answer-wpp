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
    },
    (err: Error) => {
      console.log("🚀 ~ fastifyPlugin ~ err:", err);
    }
  );
  return new CronJob(
    {
      cronExpression: "*/2 * * * *",
      timezone: "America/Recife",
    },
    task
  );
}
