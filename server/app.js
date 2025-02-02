const express = require("express");
const app = express();
const port = 8888;

const noteController = require("./controller/note");
const categoryController = require("./controller/category");

app.use(express.json()); // podpora pro application/json
app.use(express.urlencoded({ extended: true })); // podpora pro application/x-www-form-urlencoded

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/note", noteController);
app.use("/category", categoryController);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
