import { z } from "zod";

const envValidationSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
});

export const env = {
  ...envValidationSchema.parse(process.env),
};
