import fs from "node:fs/promises";
import path from "node:path";
import { langStore } from "@store";
import { parse as yamlParse } from "yaml";

export default async function loadLangYaml() {
  const fileRoute = path.join(import.meta.dirname, "..", "lang.yaml");
  const loadedFile = await fs.readFile(fileRoute, { encoding: "utf8" });

  const { lang } = yamlParse(loadedFile) as Record<
    string,
    Record<string, object>
  >;

  langStore.setState({ loadedLanguage: lang });
}
