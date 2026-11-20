import fs from "fs";
import path from "path";

export const DOWNLOADS_DIR = path.join(process.cwd(), "storage", "downloads");

// Ensure downloads directory exists
if (!fs.existsSync(DOWNLOADS_DIR)) {
  fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
}

export function getPrivateFilePath(fileName: string): string | null {
  const safeName = path.basename(fileName);
  const fullPath = path.join(DOWNLOADS_DIR, safeName);
  if (fs.existsSync(fullPath)) {
    return fullPath;
  }
  return null;
}
