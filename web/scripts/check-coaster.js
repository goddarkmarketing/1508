const https = require("https");

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        let body = "";
        res.on("data", (c) => (body += c));
        res.on("end", () => resolve({ status: res.statusCode, body }));
      })
      .on("error", reject);
  });
}

(async () => {
  for (const slug of ["coaster", "hiace", "hiace_commuter"]) {
    const r = await get(`https://www.toyota.co.th/en/model/${slug}`);
    const imgs = [
      ...r.body.matchAll(
        /(https?:\/\/[^"'\\\s>]+\.(?:jpg|jpeg|png|webp))/gi,
      ),
    ].map((m) => m[1]);
    console.log(slug, r.status, r.body.length, [...new Set(imgs)].slice(0, 8));
  }
})();
