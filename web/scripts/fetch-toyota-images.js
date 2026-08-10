const https = require("https");
const fs = require("fs");
const path = require("path");

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            Accept: "text/html,application/json",
          },
        },
        (res) => {
          if (
            res.statusCode >= 300 &&
            res.statusCode < 400 &&
            res.headers.location
          ) {
            get(new URL(res.headers.location, url).href)
              .then(resolve)
              .catch(reject);
            return;
          }
          let body = "";
          res.on("data", (c) => (body += c));
          res.on("end", () =>
            resolve({ status: res.statusCode, body, url }),
          );
        },
      )
      .on("error", reject);
  });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(
        url,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            Referer: "https://www.toyota.co.th/",
          },
        },
        (res) => {
          if (
            res.statusCode >= 300 &&
            res.statusCode < 400 &&
            res.headers.location
          ) {
            file.close();
            fs.unlinkSync(dest);
            download(new URL(res.headers.location, url).href, dest)
              .then(resolve)
              .catch(reject);
            return;
          }
          res.pipe(file);
          file.on("finish", () => file.close(() => resolve(dest)));
        },
      )
      .on("error", reject);
  });
}

(async () => {
  const pages = [
    "https://www.toyota.co.th/en/model/commuter",
    "https://www.toyota.co.th/en/model/alphard",
    "https://www.toyota.co.th/en/model/commuter/gallery",
    "https://www.toyota.co.th/en/model/alphard/gallery",
    "https://www.toyota.co.th/model/commuter/gallery",
    "https://www.toyota.co.th/model/alphard/gallery",
  ];

  const found = new Set();
  for (const page of pages) {
    const r = await get(page);
    console.log(page, r.status, r.body.length);
    const abs = [...r.body.matchAll(/(https?:\/\/[^"'\\\s>]+\.(?:jpg|jpeg|png|webp))/gi)].map(
      (m) => m[1],
    );
    const rel = [...r.body.matchAll(/(?:src|href|content|url)\(?["']?([^"'\\\s)]+\.(?:jpg|jpeg|png|webp))/gi)].map(
      (m) => m[1],
    );
    // also look for toyota CDN patterns without extension in JSON
    const cdn = [...r.body.matchAll(/(https?:\/\/[^"'\\\s>]*(?:toyota|tmt)[^"'\\\s>]*)/gi)].map(
      (m) => m[1],
    );
    abs.forEach((u) => found.add(u));
    rel.forEach((u) => found.add(u));
    console.log("sample abs", abs.slice(0, 8));
    console.log("sample rel", rel.slice(0, 12));
    console.log("cdn-ish", [...new Set(cdn)].slice(0, 10));

    // dump snippet around "gallery" or "image"
    const idx = r.body.toLowerCase().indexOf("commuter");
    if (idx > 0) console.log("snippet", r.body.slice(Math.max(0, idx - 50), idx + 200).replace(/\s+/g, " "));
  }

  fs.writeFileSync(
    path.join(__dirname, "toyota-images.json"),
    JSON.stringify([...found], null, 2),
  );
  console.log("found total", found.size);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
