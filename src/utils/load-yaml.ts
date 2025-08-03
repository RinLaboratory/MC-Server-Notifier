import fs from "node:fs/promises";
import path from "node:path";
import { parse as yamlParse } from "yaml";
import { YamlConfigSchema } from "./validators";

export default async function LoadYaml() {
  const fileRoute = path.join(import.meta.dirname, "..", "config.yaml");
  const loadedFile = await fs.readFile(fileRoute, { encoding: "utf8" });

  const { servers } = await YamlConfigSchema.parseAsync(yamlParse(loadedFile));

  return servers;
}
