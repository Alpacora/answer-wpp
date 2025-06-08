import * as dotenv from "dotenv";

import { fastifyAwilixPlugin } from "@fastify/awilix";
import fastifyCors from "@fastify/cors";
import fastifySchedule from "@fastify/schedule";
import Fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import dbConnector from "./database/connection";
import dependencyInjection from "./dependencyInjection";
import routes from "./routes";

dotenv.config();

const start = async () => {
  const fastify = Fastify({
    logger: true,
  }).withTypeProvider<ZodTypeProvider>();

  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);

  fastify.register(dbConnector);
  fastify.register(fastifyCors, {
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
  });

  fastify.register(fastifyAwilixPlugin, {
    disposeOnClose: true,
    disposeOnResponse: true,
    strictBooleanEnforced: true,
  });

  fastify.register(dependencyInjection);
  fastify.register(fastifySchedule);
  // fastify.register(registerJobs);

  fastify.register(routes, { prefix: "v1" });

  try {
    await fastify.listen({
      host: "0.0.0.0",
      port: Number(process.env.PORT) || 8080,
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
