import { ObjectId } from "mongodb";
import { z } from "zod/v4";

export const chargeSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  payday: z.number().min(1).max(31),
  message: z.string(),
});

export const chargeSchemaResponse = z
  .object({
    _id: z.instanceof(ObjectId),
    ...chargeSchema.shape,
  })
  .transform(({ _id, ...rest }) => ({
    id: _id.toString(),
    ...rest,
  }));

export const deleteChargeSchema = z.object({
  id: z.string(),
});

export type DeleteChargeParams = z.infer<typeof deleteChargeSchema>;
