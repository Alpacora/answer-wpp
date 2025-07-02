import fastifyMongo from "@fastify/mongodb";
import { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { env } from "../env";

async function dbConnector(fastify: FastifyInstance, options: Object) {
  await fastify.register(fastifyMongo, {
    url: env.DB_URL,
    database: env.DB,
    auth: {
      username: env.DB_USER,
      password: env.DB_PASSWORD,
    },
  });

  await fastify.mongo.db!
    .collection("lunch")
    .createIndex({ day: 1 }, { unique: true });
}

export default fastifyPlugin(dbConnector);
