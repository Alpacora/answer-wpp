import { ObjectId } from "mongodb";
import { z } from "zod";

const chargeSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  payday: z.number().min(1).max(31),
  message: z.string(),
});

export const chargeSchemaResponse = z
  .object({
    _id: z.instanceof(ObjectId),
  })
  .merge(chargeSchema)
  .transform(({ _id, ...rest }) => ({
    id: _id.toString(),
    ...rest,
  }));
