const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "..", "out");
const homepage = path.join(outDir, "index.html");
const hostHomepage = path.join(__dirname, "..", "..", "index.html");

function collectFiles(dir, files) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectFiles(full, files);
    else files.push(full);
  }
}

function flattenRscPayloads(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith("__next.")) {
      const parent = path.dirname(full);
      const files = [];
      collectFiles(full, files);
      for (const file of files) {
        const relative = path.relative(parent, file);
        const flatName = relative.split(path.sep).join(".");
        fs.copyFileSync(file, path.join(parent, flatName));
      }
    }
    flattenRscPayloads(full);
  }
}

if (!fs.existsSync(homepage)) {
  console.error("Missing web/out/index.html. Run the Next.js build first.");
  process.exit(1);
}

flattenRscPayloads(outDir);
fs.copyFileSync(homepage, hostHomepage);
console.log("Prepared host files: flat RSC payloads and index.html");
