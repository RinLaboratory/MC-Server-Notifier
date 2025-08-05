import fs from "node:fs/promises";
import path from "node:path";
import { parse as yamlParse } from "yaml";
import { langStore } from "~/store/lang-store";

export default async function loadLangYaml() {
  const fileRoute = path.join(import.meta.dirname, "..", "lang.yaml");
  const loadedFile = await fs.readFile(fileRoute, { encoding: "utf8" });

  const { lang } = yamlParse(loadedFile) as Record<
    string,
    Record<string, object>
  >;

  langStore.setState({ loadedLanguage: lang });
}
