import { langStore } from "@store";

export function t(
  key: string,
  params?: Record<string, string | number>,
): string {
  const { loadedLanguage } = langStore.getState();
  if (!loadedLanguage) return key;

  // Navigate object using "a.b.c" structure as route
  const text = key.split(".").reduce((obj, k) => {
    if (obj && typeof obj === "object" && k in obj) {
      return (obj as Record<string, unknown>)[k];
    }
    return undefined;
  }, loadedLanguage as unknown) as string | undefined;

  if (typeof text !== "string") return key;

  if (!params) return text;

  // Replace {{placeholder}} to values
  return text.replace(/\{\{(.*?)\}\}/g, (_, p1: string) => {
    const value = params[p1.trim()];
    return value !== undefined ? String(value) : "";
  });
}
