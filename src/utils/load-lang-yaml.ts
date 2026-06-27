import path from "node:path";
import { langStore } from "@store";
import { readFirstExistingFile } from "@utils/read-first-existing-file";
import { parse as yamlParse } from "yaml";

export default async function loadLangYaml() {
  const langDir = process.env.LANG_DIR
    ? path.resolve(process.env.LANG_DIR)
    : process.env.CONFIG_DIR
      ? path.resolve(process.env.CONFIG_DIR)
      : undefined;

  const langFileRoutes = [
    process.env.LANG_PATH ? path.resolve(process.env.LANG_PATH) : undefined,
    langDir ? path.join(langDir, "lang.yml") : undefined,
    langDir ? path.join(langDir, "lang.yaml") : undefined,
    path.join(process.cwd(), "lang.yml"),
    path.join(process.cwd(), "lang.yaml"),
    path.join(import.meta.dirname, "..", "lang.yml"),
    path.join(import.meta.dirname, "..", "lang.yaml"),
  ].filter((fileRoute): fileRoute is string => Boolean(fileRoute));

  const loadedFile = await readFirstExistingFile(langFileRoutes, "Language");

  const { lang } = yamlParse(loadedFile) as Record<
    string,
    Record<string, object>
  >;

  langStore.setState({ loadedLanguage: lang });
}
