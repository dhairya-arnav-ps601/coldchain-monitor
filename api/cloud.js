const FIREBASE_DB_URL = "https://coldchain-monitor-eb213-default-rtdb.firebaseio.com/coldchain.json";

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");

  try {
    if (req.method === "GET") {
      const response = await fetch(FIREBASE_DB_URL, { cache: "no-store" });
      const text = await response.text();
      res.status(response.status).setHeader("Content-Type", "application/json");
      return res.send(text);
    }

    if (req.method === "PUT") {
      const payload = typeof req.body === "string" ? req.body : JSON.stringify(req.body || {});
      const response = await fetch(FIREBASE_DB_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: payload
      });
      const text = await response.text();
      res.status(response.status).setHeader("Content-Type", "application/json");
      return res.send(text);
    }

    res.setHeader("Allow", "GET, PUT");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    return res.status(502).json({ error: err.message || "Cloud proxy error" });
  }
};
