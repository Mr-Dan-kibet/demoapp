const jsonServer = require("json-server");
const server = jsonServer.create();
const path = require("path");
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

const PORT = process.env.PORT || 10000;

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.patch("/bookings/:id", (req, res) => {
  const { id } = req.params;
  const db = router.db;
  const booking = db.get("bookings").find({ id }).value();

  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }

  db.get("bookings")
    .find({ id })
    .assign({ ...booking, ...req.body })
    .write();

  res.json({ ...booking, ...req.body });
});

server.put("/latestTicket", (req, res) => {
  const db = router.db;
  db.set("latestTicket", req.body).write();
  res.status(200).json(req.body);
});

server.use(router);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`JSON Server running at http://0.0.0.0:${PORT}`);
});