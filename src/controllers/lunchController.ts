import { FastifyReply, FastifyRequest } from "fastify";
import { Db } from "mongodb";
import {
  ArrayOfLunchSchemaType,
  lunchResponseSchema,
} from "src/schemas/lunchSchema";

export class LunchController {
  COLLECTION_TO_CONNECT: string = "lunch";
  database: Db;

  constructor({ database }: { database: Db }) {
    this.database = database;
  }

  async getLunch(request: FastifyRequest, reply: FastifyReply) {
    const collection = this.database.collection(this.COLLECTION_TO_CONNECT);
    const result = await collection.find().toArray();
    const mappedResult = result.map((element) =>
      lunchResponseSchema.parse(element)
    );
    reply.code(200).send(mappedResult);
  }

  async createNewLunch(request: FastifyRequest, reply: FastifyReply) {
    const collection = this.database.collection(this.COLLECTION_TO_CONNECT);
    const newLunch = request.body as ArrayOfLunchSchemaType;

    const result = await collection.insertMany(newLunch);
    reply.code(201).send(result);
  }
}
