import { ObjectId } from "mongodb";
import z from "zod/v4";

export const lunchSchema = z.object({
  day: z.string(),
  proteins: z.array(z.string()),
  sides: z.array(z.string()),
});

export const arrayOfLunchSchema = z.array(lunchSchema);
export const lunchResponseSchema = z
  .object({
    _id: z.instanceof(ObjectId),
    ...lunchSchema.shape,
  })
  .transform(({ _id, ...data }) => ({
    id: _id.toString(),
    ...data,
  }));

export const deleteLunchSchema = z.object({
  id: z.string(),
});

export type LunchSchemaType = z.infer<typeof lunchSchema>;
export type ArrayOfLunchSchemaType = z.infer<typeof arrayOfLunchSchema>;
export type DeleteLunchSchemaType = z.infer<typeof deleteLunchSchema>;
