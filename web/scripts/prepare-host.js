const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "..", "out", "index.html");
const dest = path.join(__dirname, "..", "..", "index.html");

if (!fs.existsSync(src)) {
  console.error("Missing web/out/index.html. Run the Next.js build first.");
  process.exit(1);
}

fs.copyFileSync(src, dest);
console.log("Wrote host homepage to index.html");
