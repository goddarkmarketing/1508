const https = require("https");
const fs = require("fs");
const path = require("path");

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        let body = "";
        res.on("data", (c) => (body += c));
        res.on("end", () => resolve(body));
      })
      .on("error", reject);
  });
}

(async () => {
  for (const slug of ["commuter", "alphard", "hiace"]) {
    const body = await get(`https://www.toyota.co.th/en/model/${slug}`);
    const imgs = [
      ...new Set(
        [...body.matchAll(/(https?:\/\/[^"'\\\s>]+\.webp)/gi)].map((m) => m[1]),
      ),
    ].filter(
      (u) =>
        u.includes("/grades/") ||
        u.includes("/model/") ||
        u.includes("/color/") ||
        u.includes("studio") ||
        u.includes("cut"),
    );
    console.log("\n" + slug);
    imgs.forEach((u) => console.log(u));
  }
})();
