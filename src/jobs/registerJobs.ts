import fastifyPlugin from "fastify-plugin";
import { autoStartLunchBot } from "./autoStartLunchBot";
import { autoStopLunchBot } from "./autoStopLunchBot";

export default fastifyPlugin(async (fastify) => {
  fastify.scheduler.addCronJob(autoStartLunchBot());
  fastify.scheduler.addCronJob(autoStopLunchBot());
});
