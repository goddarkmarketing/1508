const https = require("https");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const outDir = path.join(__dirname, "..", "public", "fleet");

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
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
            fetchBuffer(new URL(res.headers.location, url).href)
              .then(resolve)
              .catch(reject);
            return;
          }
          if (res.statusCode !== 200) {
            reject(new Error(`HTTP ${res.statusCode} ${url}`));
            return;
          }
          const chunks = [];
          res.on("data", (c) => chunks.push(c));
          res.on("end", () => resolve(Buffer.concat(chunks)));
        },
      )
      .on("error", reject);
  });
}

async function toWhiteBackground(input, output, size = { width: 1600, height: 1000 }) {
  await sharp(input)
    .resize({
      width: size.width,
      height: size.height,
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .flatten({ background: "#ffffff" })
    .webp({ quality: 92 })
    .toFile(output);
  console.log("white", path.basename(output), fs.statSync(output).size);
}

const downloads = [
  {
    out: "commuter-white.webp",
    url: "https://www.toyota.co.th/media/product/series/grades/v/commuter/197/0c83408ea074e4de9358f311990c576b64fb666dc3029fee432ba3d966511f98.webp",
  },
  {
    out: "commuter-alt-white.webp",
    url: "https://www.toyota.co.th/media/product/series/grades/v/commuter/197/832a74b3819444f2667efcabb5bdbb67498ec15ece9eb842e584c083153d262b.webp",
  },
  {
    out: "alphard-white.webp",
    url: "https://www.toyota.co.th/media/product/series/grades/v/alphard/33/952e91dbedfeb3e25504035e32521b863d35989005a00a20d8034b677bc19afa.webp",
  },
  {
    out: "alphard-alt-white.webp",
    url: "https://www.toyota.co.th/media/product/series/grades/v/alphard/33/e18a711ff5eb28c2a3be81717821f668952c6f03214a10a987838cf24b75e6ab.webp",
  },
  {
    out: "alphard-3-white.webp",
    url: "https://www.toyota.co.th/media/product/series/grades/v/alphard/33/64868c7e395500bb3ca382d9bd90eb7033f7dce3b9f7db22a3d57eb913f67009.webp",
  },
  {
    out: "hiace-white.webp",
    url: "https://www.toyota.co.th/media/product/series/grades/v/hiace/214/7c64131428daae1b2ac92c35d5cb6432a75c65eb3df845fa0da308e55cd5f116.webp",
  },
  {
    out: "hiace-alt-white.webp",
    url: "https://www.toyota.co.th/media/product/series/grades/v/hiace/214/15ceb096e6c2133c80d8fd1c24461939ba1c4b2754caa8e40400573370833a01.webp",
  },
  {
    out: "hiace-3-white.webp",
    url: "https://www.toyota.co.th/media/product/series/grades/v/hiace/214/72c1d6e6b88f649b5bb913db764e7a54dfb4fc80a1167786bc56f0e3a709ab5c.webp",
  },
];

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  for (const item of downloads) {
    const buf = await fetchBuffer(item.url);
    await toWhiteBackground(buf, path.join(outDir, item.out));
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
