import fs from "node:fs/promises";

export async function readFirstExistingFile(
  fileRoutes: string[],
  label: string,
) {
  const uniqueFileRoutes = Array.from(new Set(fileRoutes));

  for (const fileRoute of uniqueFileRoutes) {
    try {
      return await fs.readFile(fileRoute, { encoding: "utf8" });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        continue;
      }

      throw error;
    }
  }

  throw new Error(
    `${label} file not found. Tried: ${uniqueFileRoutes.join(", ")}`,
  );
}
