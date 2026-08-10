const https = require("https");
const fs = require("fs");
const path = require("path");

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(
        url,
        {
          headers: {
            "User-Agent": "Mozilla/5.0",
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
            try {
              fs.unlinkSync(dest);
            } catch {}
            download(new URL(res.headers.location, url).href, dest)
              .then(resolve)
              .catch(reject);
            return;
          }
          if (res.statusCode !== 200) {
            file.close();
            reject(new Error(`HTTP ${res.statusCode} ${url}`));
            return;
          }
          res.pipe(file);
          file.on("finish", () =>
            file.close(() => {
              console.log("saved", path.basename(dest), fs.statSync(dest).size);
              resolve(dest);
            }),
          );
        },
      )
      .on("error", reject);
  });
}

const outDir = path.join(__dirname, "..", "public", "fleet");
const files = [
  {
    name: "hiace-hero.webp",
    url: "https://www.toyota.co.th/media/product/series/banners/v/hiace/214/lead/feeee98611d4999063291757a3f3aefcb6e97eca8d29c9481a85b8b438fdeef9.webp",
  },
  {
    name: "hiace.webp",
    url: "https://www.toyota.co.th/media/product/series/grades/v/hiace/214/7c64131428daae1b2ac92c35d5cb6432a75c65eb3df845fa0da308e55cd5f116.webp",
  },
  {
    name: "hiace-gallery.webp",
    url: "https://www.toyota.co.th/media/product/series/banners/v/hiace/214/lead/100294c39ac3ff891cf042969075ae362970f491c18e60ff1aa511f4b63e3c84.webp",
  },
];

(async () => {
  for (const file of files) {
    await download(file.url, path.join(outDir, file.name));
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
