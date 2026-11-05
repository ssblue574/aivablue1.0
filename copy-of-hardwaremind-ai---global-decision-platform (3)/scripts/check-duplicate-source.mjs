import { readdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const scanDirs = ["components", "hooks", "services", "utils", "data", "lib", "pages"];
const codeExts = new Set([".ts", ".tsx", ".js", ".jsx"]);

const duplicates = [];

const walk = async (dir) => {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === "dist" || entry.name.startsWith(".")) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath);
      continue;
    }

    const ext = path.extname(entry.name);
    if (!codeExts.has(ext)) continue;
    if (/\(\d+\)\.[tj]sx?$/.test(entry.name)) {
      duplicates.push(path.relative(root, fullPath));
    }
  }
};

for (const relDir of scanDirs) {
  await walk(path.join(root, relDir));
}

if (duplicates.length === 0) {
  console.log("No duplicate source files detected.");
  process.exit(0);
}

console.error("Duplicate source files detected:");
for (const file of duplicates) {
  console.error(`- ${file}`);
}
console.error(`Total duplicates: ${duplicates.length}`);
process.exit(1);
