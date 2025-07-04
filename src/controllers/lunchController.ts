import { FastifyReply, FastifyRequest } from "fastify";
import fs from "fs/promises";
import { Db, ObjectId } from "mongodb";
import {
  ArrayOfLunchSchemaType,
  DeleteLunchSchemaType,
  lunchResponseSchema,
} from "../schemas/lunchSchema";
import path from "node:path";

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

  async createNewLunch(
    request: FastifyRequest<{ Body: ArrayOfLunchSchemaType }>,
    reply: FastifyReply
  ) {
    const collection = this.database.collection(this.COLLECTION_TO_CONNECT);
    const newLunch = request.body;

    const result = await collection.insertMany(newLunch);
    reply.code(201).send(result);
  }

  async deleteLunch(
    request: FastifyRequest & { params: DeleteLunchSchemaType },
    reply: FastifyReply
  ) {
    const collection = this.database.collection(this.COLLECTION_TO_CONNECT);
    await collection.deleteOne({
      _id: new ObjectId(request.params.id),
    });
    reply.code(204).send();
  }

  async readLogs(request: FastifyRequest, reply: FastifyReply) {
    const finalPath = path.join(process.cwd(), "auth_info_baileys", "logsData.txt");
    const result = await fs.readFile(finalPath, "utf-8");
    reply.code(200).send(result);
  }
}
