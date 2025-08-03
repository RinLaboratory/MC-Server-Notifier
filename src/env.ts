import { z } from "zod";

const envValidationSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  DISCORD_WEBHOOK_URL: z.string().url(),
  DISCORD_WEBHOOK_NAME: z.string(),
  DISCORD_WEBHOOK_PROFILEPICTURE: z.string().url(),
});

export const env = {
  ...envValidationSchema.parse(process.env),
};
