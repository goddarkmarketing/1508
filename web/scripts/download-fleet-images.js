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
            reject(new Error(`HTTP ${res.statusCode} for ${url}`));
            return;
          }
          res.pipe(file);
          file.on("finish", () =>
            file.close(() => {
              const size = fs.statSync(dest).size;
              console.log("saved", dest, size);
              resolve(dest);
            }),
          );
        },
      )
      .on("error", reject);
  });
}

const outDir = path.join(__dirname, "..", "public", "fleet");
fs.mkdirSync(outDir, { recursive: true });

const files = [
  {
    name: "commuter-hero.webp",
    url: "https://www.toyota.co.th/media/product/series/banners/v/commuter/197/lead/16f5f6ef4b2476db200edccb5ac7f76f9e02c38d0f53fd1c437d7b5ca7027c41.webp",
  },
  {
    name: "commuter.webp",
    url: "https://www.toyota.co.th/media/product/series/v/743/model/1150deefb2427011255524843d49f438814a4045e90da82147d8e1ecb095aa8a.webp",
  },
  {
    name: "commuter-grade.webp",
    url: "https://www.toyota.co.th/media/product/series/grades/v/commuter/197/0c83408ea074e4de9358f311990c576b64fb666dc3029fee432ba3d966511f98.webp",
  },
  {
    name: "commuter-gallery-1.webp",
    url: "https://www.toyota.co.th/media/product/series/gallery/large/ae8d7046accce6e03cb31a9997e7c88185fe35aa37acb086212dcccf5dd2b114.webp",
  },
  {
    name: "commuter-gallery-2.webp",
    url: "https://www.toyota.co.th/media/product/series/gallery/large/146c1a3795fe5b99050d38c23e6cf412098eb90504f4b7c5833e78453af0c396.webp",
  },
  {
    name: "alphard-hero.webp",
    url: "https://www.toyota.co.th/media/product/series/banners/v/alphard/33/lead/14ab66a4a5e77071cb93dcc44a29eadc46b3c21dffcc80a940f494325f75e688.webp",
  },
  {
    name: "alphard.webp",
    url: "https://www.toyota.co.th/media/product/series/v/743/model/ad44be77efc6b29813f4bdef70ee2e3ab6bca6771a3dce676af6bf30897a42ec.webp",
  },
  {
    name: "alphard-grade.webp",
    url: "https://www.toyota.co.th/media/product/series/grades/v/alphard/33/952e91dbedfeb3e25504035e32521b863d35989005a00a20d8034b677bc19afa.webp",
  },
  {
    name: "alphard-gallery-1.webp",
    url: "https://www.toyota.co.th/media/product/series/gallery/large/8636abb8201f54060e68f4b174622b6710de63f9f82f091de3cc9eadcf742c6f.webp",
  },
  {
    name: "alphard-gallery-2.webp",
    url: "https://www.toyota.co.th/media/product/series/gallery/large/9b8443a3129877b3c4ec1c186d883e1d2a74a2f454b4159f38c87a5995917687.webp",
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
