const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const fs = require("fs");

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.put("/db", upload.single("data"), (req, res) => {
  try {
    console.log(req.body);
    const jsonData = req.body;

    fs.writeFileSync("db.json", JSON.stringify(jsonData, null, 2));
    console.log(jsonData);
    res.status(200).json(jsonData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to write db.json" });
  }
});

server.use(router);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
