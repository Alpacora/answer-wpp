import fastifyMongo from "@fastify/mongodb";
import { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";

async function dbConnector(fastify: FastifyInstance, options: Object) {
  await fastify.register(fastifyMongo, {
    url: process.env.DB_URL,
    database: process.env.DB,
    auth: {
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
  });

  await fastify.mongo.db
    .collection("lunch")
    .createIndex({ day: 1 }, { unique: true });
}

export default fastifyPlugin(dbConnector);
