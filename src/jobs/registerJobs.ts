import fastifyPlugin from "fastify-plugin";
import { autoStartLunchBot } from "./autoStartLunchBot";

export default fastifyPlugin(async (fastify) => {
  fastify.scheduler.addCronJob(autoStartLunchBot());
});
