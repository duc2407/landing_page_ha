const jsonServer = require("json-server");
const fs = require("fs");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// PUT /db - cập nhật toàn bộ db.json
server.put("/db", (req, res) => {
  try {
    const jsonData = req.body; // JSON body

    // Ghi file
    fs.writeFileSync("db.json", JSON.stringify(jsonData, null, 2));

    // Chỉ log khi không phải production để giảm rate limit
    if (process.env.NODE_ENV !== "production") {
      console.log("db.json updated:", jsonData);
    }

    res.status(200).json(jsonData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to write db.json" });
  }
});

// GET /data - lấy collection 'data' từ db.json
server.get("/data", (req, res) => {
  try {
    const db = JSON.parse(fs.readFileSync("db.json", "utf-8"));
    const data = db.data || [];
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read db.json" });
  }
});

// Sử dụng router mặc định cho các route khác
server.use(router);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
