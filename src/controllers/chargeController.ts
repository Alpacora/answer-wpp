import { FastifyReply, FastifyRequest } from "fastify";
import { Db, ObjectId } from "mongodb";
import { chargeSchemaResponse, DeleteChargeParams } from "../schemas/chargeSchema";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export class ChargeController {
  COLLECTION_TO_CONNECT: string = "contacts";
  database: Db;

  constructor({ database }: { database: Db }) {
    this.database = database;
  }

  async getCharges(request: FastifyRequest, reply: FastifyReply) {
    const collection = this.database.collection(this.COLLECTION_TO_CONNECT);
    const result = await collection.find().toArray();
    const mappedResult = result.map((element) =>
      chargeSchemaResponse.parse(element)
    );
    reply.code(200).send(mappedResult);
  }

  async createNewCharger(
    request: FastifyRequest<{
      Body: {
        firstName?: string;
        lastName?: string;
        phone?: string;
        payday?: number;
        message?: string;
      };
    }>,
    reply: FastifyReply
  ) {
    const collection = this.database.collection(this.COLLECTION_TO_CONNECT);

    const hasExistsPhone = await collection.findOne({
      phone: request.body.phone,
    });

    if (hasExistsPhone) {
      return reply.code(400).send({
        statusCode: 400,
        code: "HAS_PHONE_EXISTS",
        error: "Bad Request",
        message: "Charge with this phone already exists",
      });
    }

    const rawResult = await collection.insertOne(request.body);
    const result = await collection.findOne({ _id: rawResult.insertedId });
    reply.code(201).send(result);
  }

  async deleteCharge(
    request: FastifyRequest<{ Params: DeleteChargeParams }>,
    reply: FastifyReply
  ) {
    const collection = this.database.collection(this.COLLECTION_TO_CONNECT);
    await collection.deleteOne({ _id: new ObjectId(request.params.id) });
    reply.code(204);
  }
}
